<?php

namespace App\Http\Controllers\Api;

use App\Models\Organizacao;
use App\Service\ResponseJSON;
use Illuminate\Http\Request;

class OrganizacaoController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
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

    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|max:255|min:3',
            'email' => 'required|email|max:255|unique:organizacoes,email',
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
            'numero' => 'nullable|max:255',
            'complemento' => 'nullable|max:255',
            'cidade' => 'nullable|max:255',
            'estado' => 'nullable|max:255|in:AC,AL,AP,AM,BA,CE,DF,ES,GO,MA,MT,MS,MG,PA,PB,PR,PE,PI,RJ,RN,RS,RO,RR,SC,SP,SE,TO',
            'tags' => 'nullable|array'
        ], [], [
            'endereco' => 'endereço',
            'numero' => 'número',
        ]);

        try {

            $organizacao = (new Organizacao())->criar($dados);

            return (new ResponseJSON())->setData($organizacao)->setMessage(__('custom.organizacao_criado_com_sucesso'))->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function update(Request $request, int $id)
    {
        $dados = $request->validate([
            'nome' => 'required|max:255|min:3',
            'email' => "required|email|max:255|unique:organizacoes,email,{$id}", //permitir burlar o unique para proprio dono
            'telefone' => ['nullable', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/([(][0-9]{2}[)])\s[0-9]{4,5}\-[0-9]{4}/', $value)) {
                    $fail(__('custom.validacao_telefone_valido'));
                }
            }],
            'cep' => ['nullable', 'max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/^[0-9]{5,5}([- ]?[0-9]{3,3})?$/', $value)) {
                    $fail('Informe um CEP válido');
                }
            }],
            'endereco' => 'nullable|max:255',
            'numero' => 'nullable|max:255',
            'complemento' => 'nullable|max:255',
            'cidade' => 'nullable|max:255',
            'estado' => 'nullable|max:255|in:AC,AL,AP,AM,BA,CE,DF,ES,GO,MA,MT,MS,MG,PA,PB,PR,PE,PI,RJ,RN,RS,RO,RR,SC,SP,SE,TO',
            'tags' => 'nullable|array'
        ], [], [
            'endereco' => 'endereço',
            'numero' => 'número',
        ]);

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
