<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CriarTagRequest;
use App\Http\Requests\EditarTagRequest;
use App\Models\Tag;
use App\Service\ResponseJSON;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TagController extends Controller
{

    public function index(Request $request)
    {
        try {
            $tags = (new Tag())->pesquisar(
                $request->input("pesquisa", ''),
                $request->input("sortName", "id"),
                $request->input("sortOrder", "desc")
            );

            return (new ResponseJSON())->setData($tags)->render();

        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function show(Request $request, int $tagId)
    {
        try {
            $tag = Tag::find($tagId);

            if (empty($tag)) {
                throw new \Exception(__('custom.tag_inexistente'), 404);
            }

            return (new ResponseJSON())->setData($tag)->render();
        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function store(CriarTagRequest $request)
    {
        $dados = $request->validated();

        try {
            $tag = Tag::create($dados);

            return (new ResponseJSON())->setData($tag)->setMessage(__('custom.tag_criada_com_sucesso'))->render();
        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function update(EditarTagRequest $request, int $tagId)
    {
        $dados = $request->validated();

        try {

            $tag = Tag::find($tagId);

            if (empty($tag)) {
                throw new \Exception(__('custom.tag_inexistente'), 404);
            }


            $tag->fill($dados);
            $tag->save();

            return (new ResponseJSON())->setData($tag)->setMessage(__('custom.tag_editada_com_sucesso'))->render();

        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function destroy(Request $request, int $tagId)
    {
        try {

            $tag = Tag::find($tagId);

            if (empty($tag)) {
                throw new \Exception(__('custom.tag_inexistente'), 404);
            }

            $tag->delete();

            return (new ResponseJSON())->setData($tag)->setMessage(__('custom.tag_excluida_com_sucesso'))->render();

        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }
}
