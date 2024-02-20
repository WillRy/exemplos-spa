<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Request;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];


    public function isAjax()
    {
        $isApi = str_contains(\Illuminate\Support\Facades\Request::route()->getPrefix(), 'api');
        $isJSON = \Illuminate\Support\Facades\Request::expectsJson() || \Illuminate\Support\Facades\Request::isJson();
        $isAjax = ($isApi || $isJSON) && !\Illuminate\Support\Facades\Request::header('X-Inertia');

        return $isAjax;
    }

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        // Redireciona para a a página anterior caso o CSRF TOKEN tenha expirado
        $this->renderable(function (\Exception $e, $request) {
            $is419 = $e instanceof \Symfony\Component\HttpKernel\Exception\HttpException && $e->getStatusCode() === 419 || $e->getCode() === 419;
            if (!$this->isAjax() && $is419 && $request->method() !== 'GET') {
                return redirect()->back(303)->with('error', 'Sua sessão expirou, por favor, tente novamente.');
            }

            if($is419) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sua sessão expirou, por favor, tente novamente.',
                    'errors' => null,
                    'error_code' => null,
                    "data" => [],
                ], 419);
            }
        });

        $this->renderable(function (\Illuminate\Auth\AuthenticationException $e, \Illuminate\Http\Request $request) {
            if ($this->isAjax()) {
                $error = str_replace(' (and 1 more error)', '', $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => $error,
                    'errors' => [],
                    'error_code' => null,
                    'data' => []
                ], 401);
            }
        });

        /**
         * Padroniza o JSON de response em erro de VALIDAÇÃO
         *
         * Para requests que NÃO SÃO INERTIA
         * */
        $this->renderable(function (\Illuminate\Validation\ValidationException $e, \Illuminate\Http\Request $request) {
            if ($this->isAjax()) {
                $error = str_replace(' (and 1 more error)', '', $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => $error,
                    'errors' => $e->validator->errors(),
                    'error_code' => null,
                    'data' => []
                ], 422);
            }
        });

        /**
         * Padroniza o JSON de response em erro de PERMISSÃO
         *
         * Para requests que NÃO SÃO INERTIA
         * */
        $this->renderable(function (\Illuminate\Validation\UnauthorizedException $e, \Illuminate\Http\Request $request) {
            if ($this->isAjax()) {
                $error = str_replace(' (and 1 more error)', '', $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => $error,
                    'errors' => [],
                    'error_code' => null,
                    'data' => []
                ], 403);
            }
        });
    }
}
