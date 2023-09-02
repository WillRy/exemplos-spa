<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class Locale
{


    /**
     * Descobrir qual o idioma que o browser aceita ou client da API informou que deseja receber
     */
    public function handle(Request $request, Closure $next)
    {
        $idiomasSuportados = ['pt_BR','en'];

        $session = Session::get("lang");
        if(!empty($session)) {
            $httpAcceptLanguage = $session;
        } else {
            $httpAcceptLanguage = !empty($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : "en";
        }


        $languages = explode(',', $httpAcceptLanguage);
        $result = [];
        foreach ($languages as $language) {
            $lang = explode(';q=', $language);
            // $lang == [language, weight], default weight = 1
            $result[$lang[0]] = isset($lang[1]) ? floatval($lang[1]) : 1;
        }

        arsort($result);

       $primeiroIdiomaSuportado = !empty($result) ? str_replace('-','_', array_key_first($result)) : 'en';


        if(!in_array($primeiroIdiomaSuportado, $idiomasSuportados)) {
            app()->setLocale('en');
        } else if(empty($primeiroIdiomaSuportado)){
            app()->setLocale('en');
        } else {
            app()->setLocale($primeiroIdiomaSuportado);
        }

        Session::put('lang', str_replace('_','-', app()->getLocale()));

        return $next($request);
    }

}
