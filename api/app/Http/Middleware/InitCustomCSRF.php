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

            (new CustomCSRF())->tratarCSRF();

            return $next($request);

        }

        return $next($request);
    }
}
