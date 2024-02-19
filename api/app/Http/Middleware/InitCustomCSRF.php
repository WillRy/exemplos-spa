<?php

namespace App\Http\Middleware;

use App\Service\Autenticacao;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Pipeline\Pipeline;

class InitCustomCSRF
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $autenticacao = new Autenticacao();

        if($autenticacao->hasOrigin()) {
            return (new Pipeline(app()))->send($request)->through([
                \Illuminate\Session\Middleware\StartSession::class,
            ])->then(function ($request) use ($next) {
                return $next($request);
            });
        }

        return $next($request);



    }
}
