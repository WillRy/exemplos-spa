<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Service\ResponseJSON;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
class TagController extends Controller
{
    public function index()
    {
        return inertia("painel/Tags");
    }

    public function listar(Request $request)
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

    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|max:255|unique:tags,nome',
            'cor_fundo' => ['required', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/#([a-f0-9]{3}){1,2}\b/i', $value)) {
                    $fail(__('cor_fundo_invalida'));
                }
            }],
            'cor_texto' => ['required', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/#([a-f0-9]{3}){1,2}\b/i', $value)) {
                    $fail(__('cor_texto_invalida'));
                }
            }],
        ], [], [
            'nome' => __('custom.nome'),
            'cor_fundo' => __('custom.cor_fundo'),
            'cor_texto' => __('custom.cor_texto'),
        ]);

        try {


            $tag = Tag::create($dados);

            return (new ResponseJSON())->setData($tag)->setMessage(__('custom.tag_criada_com_sucesso'))->render();
        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function update(Request $request, int $tagId)
    {
        $dados = $request->validate([
            'nome' => "required|max:255|unique:tags,nome,{$tagId}",
            'cor_fundo' => ['required', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/#([a-f0-9]{3}){1,2}\b/i', $value)) {
                    $fail(__('cor_fundo_invalida'));
                }
            }],
            'cor_texto' => ['required', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/#([a-f0-9]{3}){1,2}\b/i', $value)) {
                    $fail(__('cor_texto_invalida'));
                }
            }],
        ], [], [
            'nome' => __('custom.nome'),
            'cor_fundo' => __('custom.cor_fundo'),
            'cor_texto' => __('custom.cor_texto'),
        ]);

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
