<?php

namespace App\Http\Controllers\Api;

use App\Models\Organizacao;
use Illuminate\Http\Request;

class OrganizacaoController extends \App\Http\Controllers\Controller
{
    public function index(Request $request)
    {
        try {
            $organizacoes = (new Organizacao())->pesquisar(
                $request->input("pesquisa", null),
                $request->input("sortName", "id"),
                $request->input("sortOrder", "desc")
            );

            return $this->successAPI($organizacoes);

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }

    public function show(Request $request, int $id)
    {
        try {
            $organizacaoExiste = Organizacao::find($id);

            if (empty($organizacaoExiste)) {
                return $this->errorAPI('Organização inexistente', null, null, 404);
            }

            return $this->successAPI($organizacaoExiste);

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|max:255',
            'email' => 'required|email|max:255|unique:organizacoes,email',
            'telefone' => ['nullable','max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/([(][0-9]{2}[)])\s[0-9]{4,5}\-[0-9]{4}/',$value)) {
                    $fail('Informe um telefone válido');
                }
            }],
            'cep' => ['nullable','max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/^[0-9]{5,5}([- ]?[0-9]{3,3})?$/',$value)) {
                    $fail('Informe um CEP válido');
                }
            }],
            'endereco' => 'nullable|max:255',
            'numero' => 'nullable|max:255',
            'complemento' => 'nullable|max:255',
            'cidade' => 'nullable|max:255',
            'estado' => 'nullable|max:255|in:AC,AL,AP,AM,BA,CE,DF,ES,GO,MA,MT,MS,MG,PA,PB,PR,PE,PI,RJ,RN,RS,RO,RR,SC,SP,SE,TO'
        ], [], [
            'endereco' => 'endereço',
            'numero' => 'número',
        ]);

        try {

            $organizacao = (new Organizacao())->criar($dados);

            return $this->successAPI($organizacao, 'Organização criada com sucesso');

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }

    public function update(Request $request, int $id)
    {
        $dados = $request->validate([
            'nome' => 'required|max:255',
            'email' => "required|email|max:255|unique:organizacoes,email,{$id}", //permitir burlar o unique para proprio dono
            'telefone' => ['nullable','max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/([(][0-9]{2}[)])\s[0-9]{4,5}\-[0-9]{4}/',$value)) {
                    $fail('Informe um telefone válido');
                }
            }],
            'cep' => ['nullable','max:255', function ($attribute, $value, $fail) {
                if (!preg_match('/^[0-9]{5,5}([- ]?[0-9]{3,3})?$/',$value)) {
                    $fail('Informe um CEP válido');
                }
            }],
            'endereco' => 'nullable|max:255',
            'numero' => 'nullable|max:255',
            'complemento' => 'nullable|max:255',
            'cidade' => 'nullable|max:255',
            'estado' => 'nullable|max:255|in:AC,AL,AP,AM,BA,CE,DF,ES,GO,MA,MT,MS,MG,PA,PB,PR,PE,PI,RJ,RN,RS,RO,RR,SC,SP,SE,TO'
        ], [], [
            'endereco' => 'endereço',
            'numero' => 'número',
        ]);

        try {
            $organizacaoExiste = Organizacao::find($id);

            if (empty($organizacaoExiste)) {
                return $this->errorAPI('Organização inexistente', null, null, 404);
            }

            $organizacao = (new Organizacao())->editar($id, $dados);

            return $this->successAPI($organizacao, 'Organização editada com sucesso');

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }

    public function destroy(Request $request, int $id)
    {
        try {
            $organizacaoExiste = Organizacao::find($id);

            if (empty($organizacaoExiste)) {
                return $this->errorAPI('Organização inexistente', null, null, 404);
            }

            (new Organizacao())->deletar($id);

            return $this->successAPI(null, 'Organização excluída com sucesso');

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }
}
