<?php

use App\Http\Controllers\OrganizacaoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContatoController;
use App\Http\Controllers\LangController;
use App\Http\Controllers\PainelController;
use App\Http\Controllers\TagController;
use App\Models\Organizacao;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// mudar idioma
Route::get('/lang/{idioma}', [LangController::class,'definirIdioma'])->name("definirIdioma");

// middleware de idioma
Route::group(['middleware' => 'locale'], function() {

    Route::get('/logout', [AuthController::class,'logout'])->name("logout");

    Route::group(['middleware' => 'guest'], function() {
        Route::get('/', [AuthController::class,'login'])->name("login");
        Route::post('/logar', [AuthController::class,'logar'])->name("logar");
        Route::get('/esqueci-senha', [AuthController::class,'esqueciSenha'])->name("esqueci-senha");
        Route::get('/redefinir-senha', [AuthController::class,'redefinirSenha'])->name("redefinir-senha");
    });


    Route::group(['middleware' => 'auth:web','prefix' => 'painel'], function() {
        Route::get('/', [PainelController::class,'index'])->name("painel");
        Route::get('/organizacoes', [OrganizacaoController::class,'index'])->name("organizacao");
        Route::get('/contatos', [ContatoController::class,'index'])->name("contatos");
        Route::get('/tags', [TagController::class,'index'])->name("tags");
    });

});
