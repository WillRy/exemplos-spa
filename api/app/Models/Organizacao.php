<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organizacao extends Model
{
    use HasFactory;

    protected $table = "organizacoes";

    protected $primaryKey = 'id';

    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'cep',
        'endereco',
        'numero',
        'complemento',
        'cidade',
        'estado'
    ];

    public function pesquisar(
        ?string $pesquisa,
        ?string $sortName = "id",
        ?string $sortOrder = "desc"
    )
    {
        return self::query()
            ->select("*")
            ->selectRaw("
                (select count(*) as qtd_contatos from contatos as cont where cont.organizacao_id = organizacoes.id) as qtd_contatos
            ")
            ->when(!empty($pesquisa), function ($query) use ($pesquisa) {
                $query->where("id", "=", $pesquisa);
                $query->where("nome", "like", "%$pesquisa%");
                $query->orWhere("email", "like", "%$pesquisa%");
            })
            ->orderBy($sortName, $sortOrder)
            ->paginate(15);
    }

    public function criar(array $dados): Organizacao
    {
        return self::create($dados);
    }

    public function editar(int $id, array $dados): Organizacao
    {
        $organizacao = self::where('id', $id)->first();
        $organizacao->fill($dados);
        $organizacao->save();
        return $organizacao;
    }

    public function deletar(int $id): void
    {
        $organizacao = self::where('id', $id)->first();
        $organizacao->delete();
    }
}
