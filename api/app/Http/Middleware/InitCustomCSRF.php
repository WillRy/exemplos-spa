<?php

namespace App\Http\Middleware;

use App\Service\CustomCSRF;
use Closure;

class InitCustomCSRF
{
    public function handle(\Illuminate\Http\Request $request, Closure $next)
    {
        if ((new CustomCSRF())->fromFrontEnd()) {

            // (new CustomCSRF())->tratarCSRF();

            return $next($request);

        }

        return $next($request);
    }
}
