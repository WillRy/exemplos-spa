<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EnviaCodigoVerificadorResetSenha;
use App\Models\Token;
use App\Models\TokenAutenticacao;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

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
                return $this->errorAPI(__('auth.failed'), null, null, 401);
            }

            $user = Usuario::query()->where('email', $dados['email'])->first();

            $tokens = (new TokenAutenticacao())->salvarTodosTokens(
                $user->id
            );

            setcookie('token', $tokens->token, null, '/', null, null, true);
            setcookie('refresh_token', $tokens->refresh_token, null, '/', null, null, true);

            return $this->successAPI($tokens);

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
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
                return $this->errorAPI(__('auth.failed'), null, null, 404);
            }

            $token = (new Token())->gerarToken(
                $user->id,
                60 * 1
            );


            Mail::to($user->email)
                ->send((
                new EnviaCodigoVerificadorResetSenha(
                    $token,
                    1,
                    $dados['url']
                )
                ));

            return $this->successAPI([], __('custom.token_reset_senha_enviado'));

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
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
                return $this->errorAPI(__('custom.token_reset_senha_invalido'), null, null, 404);
            }

            $user = $tokenComUsuario->usuario;

            $temTokenValido = $tokenModel->validaToken(
                $user->id,
                $dados['token']
            );

            if (!$temTokenValido) {
                return $this->errorAPI(
                    __('custom.token_reset_senha_invalido'),
                    null,
                    null,
                    403
                );
            }

            $user->senha = Hash::make($dados['senha']);
            $user->save();

            return $this->successAPI([], __('custom.senha_redefinida'));

        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }

    public function usuarioLogado()
    {
        try {
            return $this->successAPI(Auth::user());
        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage());
        }
    }

    public function logout()
    {

        (new TokenAutenticacao())->logoutTokens();

        return $this->successAPI([]);
    }

    public function refreshToken(Request $request)
    {
        try {
            $refreshToken =   $request->input("refresh_token") ?? Cookie::get('refresh_token');

            if (empty($refreshToken)) {
                return $this->errorAPI("Invalid refresh token!",[],null, 401);
            }

            $novoToken = (new TokenAutenticacao())->refreshToken($refreshToken);


            setcookie('token', $novoToken->token, null, '/', null, null, true);
            setcookie('refresh_token', $novoToken->refresh_token, null, '/', null, null, true);

            return $this->successAPI($novoToken);
        } catch (\Exception $e) {
            return $this->errorAPI($e->getMessage(),[],null, 401);
        }
    }
}
