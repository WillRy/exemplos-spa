<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Organizacao extends Model
{
    use HasFactory;

    protected $table = 'organizacoes';

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
        'estado',
    ];

    public function contatos(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(
            Contato::class,
            'organizacao_id',
            'id'
        );
    }

    public function tags(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Tag::class,
            'organizacao_tag',
            'organizacao_id',
            'tag_id'
        );
    }

    public function pesquisar(
        ?string $pesquisa,
        ?string $sortName = 'id',
        ?string $sortOrder = 'desc',
        ?array $idTags = []
    ) {
        return self::query()
            ->select('*')
            ->selectRaw('
                (select count(*) as qtd_contatos from contatos as cont where cont.organizacao_id = organizacoes.id) as qtd_contatos
            ')
            ->with('tags')
            ->when(! empty($pesquisa), function ($query) use ($pesquisa) {
                $query->where('id', '=', $pesquisa);
                $query->where('nome', 'like', "%$pesquisa%");
                $query->orWhere('email', 'like', "%$pesquisa%");
            })
            ->when(! empty($idTags), function ($query) use ($idTags) {
                $query->whereHas('tags', function ($queryTags) use ($idTags) {
                    $queryTags->whereIn('tag_id', $idTags);
                });
            })
            ->orderBy($sortName, $sortOrder)
            ->paginate(10);
    }

    public function criar(array $dados): Organizacao
    {
        try {

            DB::beginTransaction();

            $organizacao = self::create($dados);

            if (! empty($dados['tags'])) {
                $ids = array_column($dados['tags'], 'id');

                $organizacao->tags()->sync($ids);
            }

            DB::commit();

            return $organizacao;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function editar(int $id, array $dados): Organizacao
    {
        try {

            DB::beginTransaction();

            $organizacaoExiste = Organizacao::find($id);

            if (empty($organizacaoExiste)) {
                throw new \Exception(__('custom.organizacao_inexistente'), 404);
            }

            $organizacaoExiste->fill($dados);
            $organizacaoExiste->save();

            if (array_key_exists('tags', $dados)) {
                $ids = is_array($dados['tags']) ? array_column($dados['tags'], 'id') : [];

                if (! empty($ids)) {
                    $organizacaoExiste->tags()->sync($ids);
                } else {
                    $organizacaoExiste->tags()->detach();
                }

            }

            DB::commit();

            return $organizacaoExiste;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deletar(int $id): void
    {
        $organizacaoExiste = Organizacao::find($id);

        if (empty($organizacaoExiste)) {
            throw new \Exception(__('custom.organizacao_inexistente'), 404);
        }

        $organizacaoExiste->delete();
    }
}
