<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContatoController;
use App\Http\Controllers\Api\OrganizacaoController;
use App\Http\Controllers\Api\TagsController;
use App\Http\Controllers\Api\TesteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/eloquent', [TesteController::class, 'eloquent'])->name('eloquent');
Route::get('/query', [TesteController::class, 'query'])->name('query');

Route::group(['middleware' => 'locale'], function(){
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refreshToken'])->name('refreshToken');
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function() {
        return response()->json(auth()->user());
    })->middleware('auth:api');
});

