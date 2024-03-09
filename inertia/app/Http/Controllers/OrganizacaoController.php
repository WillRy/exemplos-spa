<?php

namespace App\Http\Controllers;

use App\Http\Requests\CriarOrganizacaoRequest;
use App\Http\Requests\EditarOrganizacaoRequest;
use App\Models\Organizacao;
use App\Service\ResponseJSON;
use Illuminate\Http\Request;

class OrganizacaoController extends Controller
{
    public function index()
    {
        return inertia("painel/Organizacoes");
    }

    public function listar(Request $request)
    {
        try {
            $organizacoes = (new Organizacao())->pesquisar(
                $request->input("pesquisa", null),
                $request->input("sortName", "id"),
                $request->input("sortOrder", "desc"),
                $request->input("id_tags", [])
            );

            return (new ResponseJSON())->setData($organizacoes)->render();

        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function show(Request $request, int $id)
    {
        try {
            $organizacaoExiste = Organizacao::with("tags")->find($id);

            if (empty($organizacaoExiste)) {
                throw new \Exception(__('custom.organizacao_inexistente'), 404);
            }

            return (new ResponseJSON())->setData($organizacaoExiste)->render();

        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function store(CriarOrganizacaoRequest $request)
    {
        $dados = $request->validated();

        try {

            $organizacao = (new Organizacao())->criar($dados);

            return (new ResponseJSON())->setData($organizacao)->setMessage(__('custom.organizacao_criado_com_sucesso'))->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function update(EditarOrganizacaoRequest $request, int $id)
    {
        $dados = $request->validated();

        try {
            $organizacaoExiste = Organizacao::find($id);

            if (empty($organizacaoExiste)) {
                throw new \Exception(__('custom.organizacao_inexistente'), 404);
            }

            $organizacao = (new Organizacao())->editar($id, $dados);

            return (new ResponseJSON())->setData($organizacao)->setMessage(__('custom.organizacao_editado_com_sucesso'))->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function destroy(Request $request, int $id)
    {
        try {
            $organizacaoExiste = Organizacao::find($id);

            if (empty($organizacaoExiste)) {
                throw new \Exception(__('custom.organizacao_inexistente'), 404);
            }

            (new Organizacao())->deletar($id);

            return (new ResponseJSON())->setData([])->setMessage(__('custom.organizacao_excluido_com_sucesso'))->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }
}
