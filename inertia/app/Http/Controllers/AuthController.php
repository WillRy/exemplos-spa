<?php

namespace App\Http\Controllers;

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
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login()
    {
        return Inertia::render('auth/Login');
    }

    public function logar(Request $request)
    {

        $dados = $request->validate([
            'email' => 'required|email',
            'senha' => 'required'
        ]);

        try {

            // autentica na sessão
            $logado = Auth::guard("web")->attempt([
                'email' => $dados['email'],
                'senha' => $dados['senha']
            ]);

            if (empty($logado)) {
                return $this->errorAPI(__('auth.failed'), null, null, 401);
            }

            (new Autenticacao())->gerarAutenticacao(
                auth()->user()->id
            );


            return $this->successAPI([]);
        } catch (\Exception $e) {
            Auth::logout();

            return $this->errorAPI($e->getMessage());
        }
    }

    public function esqueciSenha()
    {
        return Inertia::render('auth/EsqueciSenha');
    }

    public function redefinirSenha(Request $request)
    {
        return Inertia::render('auth/RedefinirSenha', [
            'token' => $request->input('token')
        ]);
    }

    public function enviarEsqueciSenha(Request $request)
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

    public function enviarRedefinirSenha(Request $request)
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


    public function logout()
    {
        Auth::logout();
        return redirect()->route('login');
    }
}
