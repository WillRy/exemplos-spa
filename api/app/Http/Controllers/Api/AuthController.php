<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EnviaCodigoVerificadorResetSenha;
use App\Models\Token;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
                'password' => $dados['senha']
            ]);

            if (empty($token)) {
                return $this->errorAPI('Usuário ou senha inválidos', null, null, 401);
            }

            return $this->successAPI(['token' => $token]);

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
            $usuario = Usuario::where('email', $dados['email'])->first();

            if (empty($usuario)) {
                return $this->errorAPI('Usuário inválido', null, null, 404);
            }

            $token = (new Token())->gerarToken(
                $usuario->id,
                60 * 1
            );


            Mail::to($usuario->email)
                ->send((new EnviaCodigoVerificadorResetSenha(
                    $token,
                    1,
                    $dados['url']
                )));

            return $this->successAPI([], 'Token para reset de senha e com sucesso');

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
                    $fail('Senha deve ter 8 caracteres, letras minusculas, maísculas, numero e caracter especial!');
                }
            },
            'token' => 'required'
        ]);
        try {
            $tokenComUsuario = Token::where('token', $dados['token'])->with('usuario')->first();

            if (empty($tokenComUsuario)) {
                return $this->errorAPI('Token de reset de senha inválido', null, null, 404);
            }

            $usuario = $tokenComUsuario->usuario;

            $temTokenValido = (new Token())->validaToken(
                $usuario->id,
                $dados['token']
            );

            if (!$temTokenValido) {
                return $this->errorAPI(
                    'Token de reset de senha inválido',
                    null,
                    null,
                    403
                );
            }

            $usuario->senha = Hash::make($dados['senha']);
            $usuario->save();

            return $this->successAPI([], 'Senha redefinida com sucesso');

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
}
