<?php

namespace App\Http\Middleware;

use App\Models\Usuario;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Auth;

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
            if ($this->auth->guard($guard)->check()) {

                (new Usuario())->retornarCookieToken(Auth::user());

                return $this->auth->shouldUse($guard);
            }
        }

        (new Usuario())->logout();

        $this->unauthenticated($request, $guards);
    }
}
