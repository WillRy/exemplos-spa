<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            Auth::guard("web")->attempt([
                'email' => $dados['email'],
                'senha' => $dados['senha']
            ]);

            // gerar token jwt para ser usado via cookie ou header
            $token = Auth::guard("api")->attempt([
                'email' => $dados['email'],
                'senha' => $dados['senha']
            ]);

            if (empty($token)) {
                return $this->errorAPI(__('auth.failed'), null, null, 401);
            }

            (new Usuario())->retornarCookieToken($token);

            return $this->successAPI(['token' => $token]);
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

    public function logout()
    {
        (new Usuario())->removerCookieToken();
        Auth::logout();

    }
}
