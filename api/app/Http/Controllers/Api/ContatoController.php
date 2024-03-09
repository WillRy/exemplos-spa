<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\CriarContatoRequest;
use App\Http\Requests\EditarContatoRequest;
use App\Models\Contato;
use App\Service\ResponseJSON;
use Exception;
use Illuminate\Http\Request;

class ContatoController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        try {
            $contatos = (new Contato())->pesquisar(
                $request->input("pesquisa", null),
                $request->input("empresa_id", null),
                $request->input("sortName", "id"),
                $request->input("sortOrder", "desc")
            );

            return (new ResponseJSON())->setData($contatos)->render();

        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function show(Request $request, int $id)
    {
        try {
            $organizacaoExiste = Contato::with("organizacao")->find($id);

            if (empty($organizacaoExiste)) {
                throw new \Exception(__('custom.contato_inexistente'), 404);
            }

            return (new ResponseJSON())->setData($organizacaoExiste)->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function store(CriarContatoRequest $request)
    {
        $dados = $request->validated();

        try {

            $organizacao = (new Contato())->criar($dados);

            return (new ResponseJSON())->setData($organizacao)->setMessage(__('custom.contato_criado_com_sucesso'))->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function update(EditarContatoRequest $request, int $id)
    {
        $dados = $request->validated();

        try {
            $organizacaoExiste = Contato::find($id);

            if (empty($organizacaoExiste)) {
                throw new Exception(__('custom.contato_inexistente'), 404);
            }

            $organizacao = (new Contato())->editar($id, $dados);

            return (new ResponseJSON())->setData($organizacao)->setMessage(__('custom.contato_editado_com_sucesso'))->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function destroy(Request $request, int $id)
    {
        try {
            $organizacaoExiste = Contato::find($id);

            if (empty($organizacaoExiste)) {
                throw new Exception(__('custom.contato_inexistente'), 404);

            }

            (new Contato())->deletar($id);

            return (new ResponseJSON())->setData([])->setMessage(__('custom.contato_excluido_com_sucesso'))->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }
}
