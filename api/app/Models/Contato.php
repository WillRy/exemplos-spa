<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contato extends Model
{
    use HasFactory;

    protected $table = 'contatos';

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
        'organizacao_id',
    ];

    public function organizacao(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Organizacao::class, 'organizacao_id', 'id', 'organizacao');
    }

    public function pesquisar(
        ?string $pesquisa,
        ?string $organizacao_id = null,
        ?string $sortName = 'id',
        ?string $sortOrder = 'desc'
    ) {
        return self::query()
            ->select('*')
            ->with('organizacao')
            ->when(! empty($pesquisa), function ($query) use ($pesquisa) {
                $query->where('id', '=', $pesquisa);
                $query->where('nome', 'like', "%$pesquisa%");
                $query->orWhere('email', 'like', "%$pesquisa%");
            })
            ->when(! empty($organizacao_id), function ($query) use ($organizacao_id) {
                $query->where('organizacao_id', '=', $organizacao_id);
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
