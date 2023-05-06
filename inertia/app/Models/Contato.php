<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contato extends Model
{
    use HasFactory;

    protected $table = "contatos";

    protected $primaryKey = 'id';

    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'cep',
        'endereco',
        'bairro',
        'numero',
        'complemento',
        'cidade',
        'estado',
        'organizacao_id'
    ];

    public function organizacao()
    {
        return $this->belongsTo(Organizacao::class, 'organizacao_id', 'id');
    }

    public function pesquisar(
        ?string $pesquisa,
        ?string $sortName = "id",
        ?string $sortOrder = "desc"
    )
    {
        return self::query()
            ->select('*')
            //subquery para permitir ordenar query principal junto a subquery de relacionamento
            ->selectRaw("
                (select nome as organizacao from organizacoes as org where org.id = contatos.organizacao_id) as organizacao
            ")
            ->when(!empty($pesquisa), function ($query) use ($pesquisa) {
                $query->where("id", "=", $pesquisa);
                $query->where("nome", "like", "%$pesquisa%");
                $query->orWhere("email", "like", "%$pesquisa%");
            })
            ->orderBy($sortName, $sortOrder)
            ->paginate(15);
    }

    public function criar(array $dados): Contato
    {
        return self::create($dados);
    }

    public function editar(int $id, array $dados): Contato
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
