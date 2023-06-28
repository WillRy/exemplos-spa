<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContatoController;
use App\Http\Controllers\Api\OrganizacaoController;
use App\Http\Controllers\Api\TagsController;
use App\Http\Controllers\Api\TesteController;
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

Route::get('/eloquent', [TesteController::class, 'eloquent'])->name('eloquent');
Route::get('/query', [TesteController::class, 'query'])->name('query');

Route::group(['middleware' => 'locale'], function(){
    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/esqueci-senha', [AuthController::class, 'esqueciSenha'])
        ->name('esqueci-senha');

        Route::post('/redefinir-senha', [AuthController::class, 'redefinirSenha'])
        ->name('password.reset');

    //rotas privadas
    Route::group(['middleware' => ['auth:web']], function () {
        Route::get('/usuario', [AuthController::class, 'usuarioLogado'])->name('usuarioLogado');
        Route::post('/logout', [AuthController::class, 'logout']);



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
            Route::get('/', [TagsController::class, 'index'])->name('tag.index');
            Route::get('/{id}', [TagsController::class, 'show'])->name('tag.show');
            Route::post('/', [TagsController::class, 'store'])->name('tag.store');
            Route::put('/{id}', [TagsController::class, 'update'])->name('tag.update');
            Route::delete('/{id}', [TagsController::class, 'destroy'])->name('tag.destroy');
        });
    });

});

