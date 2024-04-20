<?php

namespace App\Http\Middleware;

use App\Service\CustomCSRF;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Pipeline\Pipeline;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

class InitCustomCSRF
{

    public function handle( \Illuminate\Http\Request $request, Closure $next)
    {
        if ((new CustomCSRF())->hasOrigin()) {

            return (new Pipeline(app()))->send($request)->through([
                \Illuminate\Cookie\Middleware\EncryptCookies::class,
                \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
                \Illuminate\Session\Middleware\StartSession::class,
            ])->then(function ($request) use ($next) {
                // (new CustomCSRF())->tratarCSRF();

                return $next($request);
            });

        }

        return $next($request);
    }
}
