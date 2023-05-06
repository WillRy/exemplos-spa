<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class LangController extends Controller
{
    public function definirIdioma(string $idioma)
    {
        $idiomasSuportados = ['pt-BR','en'];

        $permitido = in_array($idioma, $idiomasSuportados);

        if($permitido) {
            $idiomaFormatadoLaravel = str_replace('-','_',$idioma);
            $idiomaFormatadoHTML = str_replace('_','-',$idioma);
        } else {
            $padrao = 'pt-BR';

            $idiomaFormatadoLaravel = str_replace('-','_',$padrao);
            $idiomaFormatadoHTML = str_replace('_','-',$padrao);
        }

        app()->setLocale($idiomaFormatadoLaravel);

        Session::put('lang', $idiomaFormatadoHTML);

        return redirect()->route('painel');
    }
}
