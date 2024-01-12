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

            setcookie('token', $tokens->token, null, '/', null, null, true);
            setcookie('refresh_token', $tokens->refresh_token, null, '/', null, null, true);

            return (new ResponseJSON())->setData($tokens)->setMessage('Bem vindo!')->render();


        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function esqueciSenha(Request $request)
    {
        $dados = $request->validate([
            'email' => 'required|email',
            'url' => 'required|url'
        ]);

        try {
            $user = (new Usuario())->userByEmail($dados['email']);

            if (empty($user)) {
                throw new \Exception(__('auth.failed'), 404);
            }

            $token = (new Token())->gerarToken(
                $user->id,
                60 * 1
            );


            Mail::to($user->email)
                ->send(new EnviaCodigoVerificadorResetSenha(
                    $token,
                    1,
                    $dados['url']
                ));


            return (new ResponseJSON())->setMessage(__('custom.token_reset_senha_enviado'))->render();

        } catch (\Exception $e) {
            return (new ResponseJSON())->setError($e)->render();
        }
    }

    public function redefinirSenha(Request $request)
    {
        $dados = $request->validate([
            'senha' => function ($attribute, $value, $fail) {
                $uppercase = preg_match('@[A-Z]@', $value);
                $lowercase = preg_match('@[a-z]@', $value);
                $number = preg_match('@[0-9]@', $value);
                $specialChars = preg_match('@[^\w]@', $value);

                if (!$uppercase || !$lowercase || !$number || !$specialChars || strlen($value) < 8) {
                    $fail(__('custom.validacao_senha_forte'));
                }
            },
            'token' => 'required'
        ]);
        try {
            $tokenModel = new Token();
            $tokenComUsuario = $tokenModel->tokenComUsuario($dados['token']);

            if (empty($tokenComUsuario)) {
                throw new \Exception(__('custom.token_reset_senha_invalido'), 404);
            }

            $user = $tokenComUsuario->usuario;

            $temTokenValido = $tokenModel->validaToken(
                $user->id,
                $dados['token']
            );

            if (!$temTokenValido) {
                throw new \Exception(__('custom.token_reset_senha_invalido'), 403);
            }

            $user->senha = Hash::make($dados['senha']);
            $user->save();

            return (new ResponseJSON())->setMessage(__('custom.senha_redefinida'))->render();


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
                return $this->errorAPI("Invalid refresh token!", 401);
            }

            $novoToken = (new Autenticacao())->refreshToken($refreshToken);


            setcookie('token', $novoToken->token, null, '/', null, null, true);
            setcookie('refresh_token', $novoToken->refresh_token, null, '/', null, null, true);

            return (new ResponseJSON())->setData($novoToken)->render();
        } catch (\Exception $e) {

            (new Autenticacao())->logoutTokens();

            return (new ResponseJSON())->setError($e)->setStatusCode(401)->render();
        }
    }
}
