<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organizacao;
use App\Service\HelperArray;
use Illuminate\Support\Facades\DB;

class TestController extends Controller
{
    public function testQueries()
    {
        $dados = Organizacao::query()
            ->with('contatos', function ($query) {
                $query->where('nome', 'like', '%teste%');
            })
            ->whereHas('contatos', function ($query) {
                $query->where('nome', 'like', '%teste%');
            })
            ->get();

        // $resultado = DB::table('organizacoes')
        //     ->selectRaw("
        //         organizacoes.id,
        //         organizacoes.nome,
        //         contatos.id as contato_id,
        //         contatos.nome as contato
        //     ")
        //     ->join('contatos', 'organizacoes.id', '=', 'contatos.organizacao_id')
        //     ->where('contatos.nome', 'like', '%teste%')
        //     ->get();

        // foreach ($resultado as $item) {
        //     $dados[$item->id]['id'] = $item->id;
        //     $dados[$item->id]['organizacao'] = $item->nome;
        //     $dados[$item->id]['contatos'][] = [
        //         'id' => $item->contato_id,
        //         'nome' => $item->contato
        //     ];
        // }

        // HelperArray::removerChavesNumericas($dados);

        return response()->json($dados);
    }
}
