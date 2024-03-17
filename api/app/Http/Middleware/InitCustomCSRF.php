<?php

namespace App\Http\Middleware;

use App\Service\Autenticacao;
use App\Service\CustomCSRF;
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
        if ((new CustomCSRF())->hasOrigin()) {
            return (new Pipeline(app()))->send($request)->through([
                \Illuminate\Cookie\Middleware\EncryptCookies::class,
                \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
                \Illuminate\Session\Middleware\StartSession::class,
            ])->then(function ($request) use ($next) {

                (new CustomCSRF())->tratarCSRF();

                return $next($request);
            });
        }

        return $next($request);
    }
}
