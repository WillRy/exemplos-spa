<?php

namespace App\Http\Middleware;

use App\Service\Autenticacao;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('login');
        }
    }

    protected function authenticate($request, array $guards)
    {
        if (empty($guards)) {
            $guards = [null];
        }

        foreach ($guards as $guard) {
            $valido = $this->auth->guard($guard)->check();

            if ($guard === 'api' && $valido) {
                $valido = (new Autenticacao())->isLogged(Autenticacao::tokenRequest());
            }

            if ($valido) {
                return $this->auth->shouldUse($guard);
            }
        }

        $this->unauthenticated($request, $guards);
    }
}
