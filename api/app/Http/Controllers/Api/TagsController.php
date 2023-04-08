<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TagsController extends Controller
{

    public function index(Request $request)
    {
        try {
            $organizacoes = (new Tag())->pesquisar(
                $request->input("pesquisa", ''),
                $request->input("sortName", "id"),
                $request->input("sortOrder", "desc")
            );

            return $this->successAPI($organizacoes);

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }

    public function show(Request $request, int $tagId)
    {
        try {
            $tag = Tag::find($tagId);

            if (empty($tagId)) {
                return $this->errorAPI(__('custom.tag_inexistente'), null, null, 404);
            }

            return $this->successAPI($tag);

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|max:255|unique:tags,nome',
            'cor_fundo' => 'required|max:255',
            'cor_texto' => 'required|max:255',
        ], [], [
            'nome' => __('custom.nome'),
            'cor_fundo' => __('custom.cor_fundo'),
            'cor_texto' => __('custom.cor_texto'),
        ]);

        try {


            $tag = Tag::create($dados);

            return $this->successAPI($tag, __('custom.tag_criada_com_sucesso'));

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }

    public function update(Request $request, int $tagId)
    {
        $dados = $request->validate([
            'nome' => "required|max:255|unique:tags,nome,{$tagId}",
            'cor_fundo' => 'required|max:255',
            'cor_texto' => 'required|max:255',
        ], [], [
            'nome' => __('custom.nome'),
            'cor_fundo' => __('custom.cor_fundo'),
            'cor_texto' => __('custom.cor_texto'),
        ]);

        try {

            $tag = Tag::find($tagId);

            if (empty($tag)) {
                return $this->errorAPI(__('custom.tag_inexistente'), null, null, 404);
            }


            $tag->fill($dados);
            $tag->save();

            return $this->successAPI($tag, __('custom.tag_editada_com_sucesso'));

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }

    public function destroy(Request $request, int $tagId)
    {
        try {

            $tag = Tag::find($tagId);

            if (empty($tag)) {
                return $this->errorAPI(__('custom.tag_inexistente'), null, null, 404);
            }

            $tag->delete();

            return $this->successAPI($tag, __('custom.tag_excluida_com_sucesso'));

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }
}