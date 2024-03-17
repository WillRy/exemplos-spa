<?php

use App\Http\Controllers\OrganizacaoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContatoController;
use App\Http\Controllers\LangController;
use App\Http\Controllers\PainelController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

// mudar idioma
Route::get('/lang/{idioma}', [LangController::class, 'definirIdioma'])->name("definirIdioma");

// middleware de idioma
Route::group(['middleware' => 'locale'], function () {

    Route::get('/logout', [AuthController::class, 'logout'])->name("logout");


    Route::post('/esqueci-senha', [AuthController::class, 'enviarEsqueciSenha'])
        ->name('esqueci-senha');

    Route::post('/redefinir-senha', [AuthController::class, 'enviarRedefinirSenha'])
        ->name('password.reset');

    Route::group(['middleware' => 'guest'], function () {
        Route::get('/', [AuthController::class, 'login'])->name("login");
        Route::post('/logar', [AuthController::class, 'logar'])->name("logar");
        Route::get('/esqueci-senha', [AuthController::class, 'esqueciSenha'])->name("esqueci-senha");
        Route::get('/redefinir-senha', [AuthController::class, 'redefinirSenha'])->name("redefinir-senha");
    });


    Route::group(['middleware' => 'auth:web'], function () {
        Route::get('/painel', [PainelController::class, 'index'])->name("painel");
        Route::get('/organizacoes', [OrganizacaoController::class, 'index'])->name("organizacao");
        Route::get('/contatos', [ContatoController::class, 'index'])->name("contatos");
        Route::get('/tags', [TagController::class, 'index'])->name("tags");

        Route::get('/usuario', [AuthController::class, 'usuarioLogado'])->name('usuarioLogado');



        Route::group(['prefix' => 'organizacao'], function () {
            Route::get('/', [OrganizacaoController::class, 'listar'])->name('organizacao.listar');
            Route::get('/{id}', [OrganizacaoController::class, 'show'])->name('organizacao.show');
            Route::post('/', [OrganizacaoController::class, 'store'])->name('organizacao.store');
            Route::put('/{id}', [OrganizacaoController::class, 'update'])->name('organizacao.update');
            Route::delete('/{id}', [OrganizacaoController::class, 'destroy'])->name('organizacao.destroy');
        });

        Route::group(['prefix' => 'contato'], function () {
            Route::get('/', [ContatoController::class, 'listar'])->name('contato.listar');
            Route::get('/{id}', [ContatoController::class, 'show'])->name('contato.show');
            Route::post('/', [ContatoController::class, 'store'])->name('contato.store');
            Route::put('/{id}', [ContatoController::class, 'update'])->name('contato.update');
            Route::delete('/{id}', [ContatoController::class, 'destroy'])->name('contato.destroy');
        });

        Route::group(['prefix' => 'tag'], function () {
            Route::get('/', [TagController::class, 'listar'])->name('tag.listar');
            Route::get('/{id}', [TagController::class, 'show'])->name('tag.show');
            Route::post('/', [TagController::class, 'store'])->name('tag.store');
            Route::put('/{id}', [TagController::class, 'update'])->name('tag.update');
            Route::delete('/{id}', [TagController::class, 'destroy'])->name('tag.destroy');
        });
    });
});
