<?php

namespace App\Http\Controllers\Api;

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

    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|max:255|min:3',
            'email' => 'required|email|max:255|unique:contatos,email',
            'telefone' => ['nullable', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/([(][0-9]{2}[)])\s[0-9]{4,5}\-[0-9]{4}/', $value)) {
                    $fail(__('custom.validacao_telefone_valido'));
                }
            }],
            'cep' => ['nullable', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/^[0-9]{5,5}([- ]?[0-9]{3,3})?$/', $value)) {
                    $fail(__('custom.validacao_cep_valido'));
                }
            }],
            'endereco' => 'nullable|max:255',
            'bairro' => 'nullable|max:255',
            'numero' => 'nullable|max:255',
            'complemento' => 'nullable|max:255',
            'cidade' => 'nullable|max:255',
            'estado' => 'nullable|max:255|in:AC,AL,AP,AM,BA,CE,DF,ES,GO,MA,MT,MS,MG,PA,PB,PR,PE,PI,RJ,RN,RS,RO,RR,SC,SP,SE,TO',
            'organizacao_id' => 'nullable|exists:organizacoes,id'
        ], [], [
            'endereco' => 'endereço',
            'numero' => 'número',
            'organizacao_id' => 'organização',
        ]);

        try {

            $organizacao = (new Contato())->criar($dados);

            return (new ResponseJSON())->setData($organizacao)->setMessage(__('custom.contato_criado_com_sucesso'))->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function update(Request $request, int $id)
    {
        $dados = $request->validate([
            'nome' => 'required|max:255|min:3',
            'email' => "required|email|max:255|unique:contatos,email,{$id}", //permitir burlar o unique para proprio dono
            'telefone' => ['nullable', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/([(][0-9]{2}[)])\s[0-9]{4,5}\-[0-9]{4}/', $value)) {
                    $fail(__('custom.validacao_telefone_valido'));
                }
            }],
            'cep' => ['nullable', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/^[0-9]{5,5}([- ]?[0-9]{3,3})?$/', $value)) {
                    $fail(__('custom.validacao_cep_valido'));
                }
            }],
            'endereco' => 'nullable|max:255',
            'bairro' => 'nullable|max:255',
            'numero' => 'nullable|max:255',
            'complemento' => 'nullable|max:255',
            'cidade' => 'nullable|max:255',
            'estado' => 'nullable|max:255|in:AC,AL,AP,AM,BA,CE,DF,ES,GO,MA,MT,MS,MG,PA,PB,PR,PE,PI,RJ,RN,RS,RO,RR,SC,SP,SE,TO',
            'organizacao_id' => 'nullable|exists:organizacoes,id'
        ], [], [
            'endereco' => 'endereço',
            'numero' => 'número',
            'organizacao_id' => 'organização',
        ]);

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
