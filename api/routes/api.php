<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContatoController;
use App\Http\Controllers\Api\OrganizacaoController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\TestController;
use App\Service\CustomCSRF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/csrf', function (Request $request) {
    return response()->json(['csrf' => (new CustomCSRF())->iniciarCSRF()]);
});

Route::get('/test-queries', [TestController::class, 'testQueries']);

Route::group(['middleware' => 'locale'], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refreshToken'])->name('refreshToken');
    Route::any('/logout', [AuthController::class, 'logout']);

    Route::post('/esqueci-senha', [AuthController::class, 'esqueciSenha'])
        ->name('esqueci-senha');

    Route::post('/redefinir-senha', [AuthController::class, 'redefinirSenha'])
        ->name('password.reset');

    //rotas privadas
    Route::group(['middleware' => ['auth:api']], function () {

        Route::get('/usuario', [AuthController::class, 'usuarioLogado'])->name('usuarioLogado');

        Route::group(['prefix' => 'organizacao'], function () {
            Route::get('/', [OrganizacaoController::class, 'index'])->name('organizacao.index');
            Route::get('/{id}', [OrganizacaoController::class, 'show'])->name('organizacao.show');
            Route::post('/', [OrganizacaoController::class, 'store'])->name('organizacao.store');
            Route::put('/{id}', [OrganizacaoController::class, 'update'])->name('organizacao.update');
            Route::delete('/{id}', [OrganizacaoController::class, 'destroy'])->name('organizacao.destroy');
        });

        Route::group(['prefix' => 'contato'], function () {
            Route::get('/', [ContatoController::class, 'index'])->name('contato.index');
            Route::get('/{id}', [ContatoController::class, 'show'])->name('contato.show');
            Route::post('/', [ContatoController::class, 'store'])->name('contato.store');
            Route::put('/{id}', [ContatoController::class, 'update'])->name('contato.update');
            Route::delete('/{id}', [ContatoController::class, 'destroy'])->name('contato.destroy');
        });

        Route::group(['prefix' => 'tag'], function () {
            Route::get('/', [TagController::class, 'index'])->name('tag.index');
            Route::get('/{id}', [TagController::class, 'show'])->name('tag.show');
            Route::post('/', [TagController::class, 'store'])->name('tag.store');
            Route::put('/{id}', [TagController::class, 'update'])->name('tag.update');
            Route::delete('/{id}', [TagController::class, 'destroy'])->name('tag.destroy');
        });
    });
});
