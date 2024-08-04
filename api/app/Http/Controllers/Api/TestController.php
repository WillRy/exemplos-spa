<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organizacao;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function testQueries()
    {
        $dados = Organizacao::query()
            ->with('contatos', function($query) {
                $query->where('nome','like','%teste%');
            })
            ->whereHas('contatos', function($query) {
                $query->where('nome','like','%teste%');
            })
            ->get();

        return response()->json($dados);
    }
}
