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
        $isApi = str_contains(Request::route()->getPrefix(), 'api');
        $isJSON = Request::expectsJson() || Request::isJson();
        $isAjax = ($isApi || $isJSON) && !Request::header('X-Inertia');

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
