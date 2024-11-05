<?php

use App\Http\Middleware\Authenticate;
use App\Http\Middleware\InitCustomCSRF;
use App\Http\Middleware\Locale;
use App\Service\CustomCSRF;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Cookie;

function isAjax()
{
    $route = \Illuminate\Support\Facades\Request::route();

    if (empty($route)) {
        return false;
    }

    $isApi = str_contains($route->getPrefix(), 'api');
    $isJSON = \Illuminate\Support\Facades\Request::expectsJson() || \Illuminate\Support\Facades\Request::isJson();
    $isAjax = ($isApi || $isJSON) && ! \Illuminate\Support\Facades\Request::header('X-Inertia');

    return $isAjax;
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
        $middleware->alias([
            'auth' => Authenticate::class,
            'locale' => Locale::class,
        ]);
        $middleware->appendToGroup('api', [
            InitCustomCSRF::class,
        ]);
        $middleware->encryptCookies([
            'token',
            'refresh_token',
            'CSRF-TOKEN',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->renderable(function (\Exception $e, $request) {
            $is419 = $e instanceof \Symfony\Component\HttpKernel\Exception\HttpException && $e->getStatusCode() === 419 || $e->getCode() === 419;

            if ($is419) {
                Cookie::expire(CustomCSRF::$cookieName);
            }

            if (! isAjax() && $is419 && $request->method() !== 'GET') {
                return redirect()->back(303)->with('error', 'Sua sessão expirou, por favor, tente novamente.');
            }

            if ($is419) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sua sessão expirou, por favor, tente novamente.',
                    'errors' => null,
                    'error_code' => null,
                    'data' => [],
                ], 419);
            }
        });

        $exceptions->renderable(function (\Illuminate\Auth\AuthenticationException $e, \Illuminate\Http\Request $request) {
            if (isAjax()) {
                $error = str_replace(' (and 1 more error)', '', $e->getMessage());

                return response()->json([
                    'success' => false,
                    'message' => $error,
                    'errors' => [],
                    'error_code' => null,
                    'data' => [],
                ], 401);
            }
        });

        /**
         * Padroniza o JSON de response em erro de VALIDAÇÃO
         *
         * Para requests que NÃO SÃO INERTIA
         * */
        $exceptions->renderable(function (\Illuminate\Validation\ValidationException $e, \Illuminate\Http\Request $request) {
            if (isAjax()) {
                $error = str_replace(' (and 1 more error)', '', $e->getMessage());

                return response()->json([
                    'success' => false,
                    'message' => $error,
                    'errors' => $e->validator->errors(),
                    'error_code' => null,
                    'data' => [],
                ], 422);
            }
        });

        /**
         * Padroniza o JSON de response em erro de PERMISSÃO
         *
         * Para requests que NÃO SÃO INERTIA
         * */
        $exceptions->renderable(function (\Illuminate\Validation\UnauthorizedException $e, \Illuminate\Http\Request $request) {
            if (isAjax()) {
                $error = str_replace(' (and 1 more error)', '', $e->getMessage());

                return response()->json([
                    'success' => false,
                    'message' => $error,
                    'errors' => [],
                    'error_code' => null,
                    'data' => [],
                ], 403);
            }
        });
    })->create();
