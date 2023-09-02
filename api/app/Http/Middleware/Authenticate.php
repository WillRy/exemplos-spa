<?php

namespace App\Http\Middleware;


use Illuminate\Auth\Middleware\Authenticate as Middleware;
use App\Models\TokenAutenticacao;
use Illuminate\Support\Facades\Cookie;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param \Illuminate\Http\Request $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) {
            return route('login');
        }
    }

    protected function authenticate($request, array $guards)
    {
        if (empty($guards)) {
            $guards = [null];
        }

        foreach ($guards as $guard) {
            $autenticado = $this->auth->guard($guard)->check();

            if ($guard === 'api' && $autenticado) {
                $jwt = $request->bearerToken() ?? Cookie::get('token');

                $valido = (new TokenAutenticacao())->tokenValido($jwt);

                if ($valido) {
                    return $this->auth->shouldUse($guard);
                }

            }
        }



        $this->unauthenticated($request, $guards);
    }
}
