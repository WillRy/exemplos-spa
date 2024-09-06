<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $table = 'tags';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nome',
        'cor_fundo',
        'cor_texto',
    ];

    public function organizacoes()
    {
        return $this->belongsToMany(
            Organizacao::class,
            'organizacao_tag',
            'tag_id',
            'organizacao_id'
        );
    }

    public function pesquisar(
        ?string $pesquisa = '',
        ?string $ordenarNome = 'id',
        ?string $ordenarOrdem = 'desc'
    ) {
        return self::query()
            ->when(! empty($pesquisa), function ($query) use ($pesquisa) {
                $pesquisaPlaceholder = "%$pesquisa%";
                $query->where('id', 'like', $pesquisaPlaceholder);
                $query->orWhere('nome', 'like', $pesquisaPlaceholder);
            })
            ->orderBy($ordenarNome, $ordenarOrdem)
            ->paginate(10);
    }

    public function editar(
        int $id,
        array $dados
    ) {
        $tag = Tag::find($id);

        if (empty($tag)) {
            throw new \Exception(__('custom.tag_inexistente'), 404);
        }

        $tag->fill($dados);
        $tag->save();

        return $tag;
    }
}
