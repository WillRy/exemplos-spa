<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EnviaCodigoVerificadorResetSenha;
use App\Models\Organizacao;
use App\Models\Token;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

class TesteController extends Controller
{
    public function eloquent(Request $request)
    {
        /**
         * Quero pegar SOMENTE as organizações que tem usuarios
         *
         * with: traz os relacionamentos, mas e a obrigatoriedade?
         * whereHas: torna obrigatorio a presença do relacionamento
         */

        //  $dados = Organizacao::with("contatos")->whereHas('contatos')->get();
        $dados = Organizacao::with("contatos")
            ->with("tags")
            ->whereHas("contatos")
            ->whereHas("tags")
            ->get();

        //  $dados = Organizacao::with("contatos", function($query) {
        //     $query->with("endereco", function($query) {
        //         $query->where("endereco.ativo", true);

        //         $query->with("pais", function($query) {
        //             $query->where("desconto", true);

        //             $query->with("pais", function($query) {

        //             });
        //         });
        //     });
        //  })->whereHas("contatos")->get();

        return response()->json($dados);
    }

    public function query()
    {
        $organizacoes = DB::table("organizacoes AS org")
            ->selectRaw("
                org.*,
                c.id as contato_id,
                c.nome as contato_nome,
                c.email as contato_email,
                c.telefone as contato_telefone,
                c.cep as contato_cep,
                c.endereco  as contato_endereco,
                c.bairro  as contato_bairro,
                c.numero  as contato_numero,
                c.complemento  as contato_complemento,
                c.cidade  as contato_cidade,
                c.estado  as contato_estado
            ")
            ->join("contatos AS c", "c.organizacao_id", "=", "org.id")
            ->get();


        // $result = $organizacoes;
        $result = [];
        foreach ($organizacoes as $key => $organizacao) {
            $result[$organizacao->id]['id'] = $organizacao->id;
            $result[$organizacao->id]['nome'] = $organizacao->nome;
            $result[$organizacao->id]['email'] = $organizacao->email;
            $result[$organizacao->id]['telefone'] = $organizacao->telefone;
            $result[$organizacao->id]['cep'] = $organizacao->cep;
            $result[$organizacao->id]['endereco'] = $organizacao->endereco;
            $result[$organizacao->id]['numero'] = $organizacao->numero;
            $result[$organizacao->id]['complemento'] = $organizacao->complemento;
            $result[$organizacao->id]['cidade'] = $organizacao->cidade;
            $result[$organizacao->id]['estado'] = $organizacao->estado;



            $result[$organizacao->id]['contatos'][$organizacao->contato_id] = [
                'id' => $organizacao->contato_id,
                'nome' => $organizacao->contato_nome,
                'email' => $organizacao->contato_email,
                'telefone' => $organizacao->contato_telefone,
                'cep' => $organizacao->contato_cep,
                'endereco' => $organizacao->contato_endereco,
                'numero' => $organizacao->contato_numero,
                'complemento' => $organizacao->contato_complemento,
                'cidade' => $organizacao->contato_cidade,
                'estado' => $organizacao->contato_estado
            ];
        }


        $result = $this->removerChaves($result);
        return response()->json($result);
    }

    public function removerChaves(array &$array = [])
    {
        if (empty($array)) {
            return $array;
        }

        foreach ($array as $key => &$value) {
            if (is_array($value)) {
                $this->removerChaves($value);
                $array[$key] = $value;
            }
        }

        $keys = array_keys($array);

        if (is_numeric($keys[0])) {
            $array = array_values($array);
        }

        return $array;
    }
}
