<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EnviaCodigoVerificadorResetSenha;
use App\Models\Token;
use App\Models\Usuario;
use App\Service\Autenticacao;
use App\Service\ResponseJSON;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $dados = $request->validate([
            'email' => 'required|email',
            'senha' => 'required'
        ]);

        try {

            $token = Auth::guard("api")->attempt([
                'email' => $dados['email'],
                'senha' => $dados['senha']
            ]);

            if (empty($token)) {
                throw new \Exception(__('auth.failed'), 401);
            }

            $user = Usuario::query()->where('email', $dados['email'])->first();

            $tokens = (new Autenticacao())->gerarAutenticacao(
                $user->id
            );


            return (new ResponseJSON())->setData($tokens)->setMessage('Bem vindo!')->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }


    public function usuarioLogado()
    {
        try {
            return $this->successAPI(Auth::user());
        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function logout()
    {

        (new Autenticacao())->logoutTokens();

        return (new ResponseJSON())->setData([])->render();
    }

    public function refreshToken(Request $request)
    {
        try {
            $refreshToken = $request->input("refresh_token") ?? Cookie::get('refresh_token');

            if (empty($refreshToken)) {
                throw new \Exception("Invalid refresh token!", 401);
            }

            $novoToken = (new Autenticacao())->refreshToken($refreshToken);


            return (new ResponseJSON())->setData($novoToken)->render();
        } catch (\Exception $e) {

            (new Autenticacao())->logoutTokens();

            return (new ResponseJSON())->setError($e)->setStatusCode(401)->render();
        }
    }
}
