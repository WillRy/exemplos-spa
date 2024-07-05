<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class Locale
{
    public $idiomaPadrao = 'pt-BR';

    public static $idiomasSuportados = ['pt-BR', 'en'];

    public static function formataIdiomaPadraoLaravel(string $idioma)
    {
        return str_replace('-', '_', $idioma);
    }

    public static function verificaIdiomaSuportado(string $idioma)
    {
        // Normaliza o valor procurado substituindo hífen por sublinhado e vice-versa
        $valorProcuradoNormalizado = str_replace(['-', '_'], '_', $idioma);

        foreach (self::$idiomasSuportados as $valor) {
            // Normaliza o valor atual do array
            $valorNormalizado = str_replace(['-', '_'], '_', $valor);

            // Compara os valores normalizados
            if ($valorNormalizado === $valorProcuradoNormalizado) {
                return true;
            }
        }

        return false;
    }

    /**
     * Descobrir qual o idioma que o browser aceita ou client da API informou que deseja receber
     */
    public function handle(Request $request, Closure $next)
    {
        $session = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? config('app.locale') ?? 'pt-BR';

        //verifica se tem idioma salvo na sessão, se não pega do browser
        if (! empty($session)) {
            $httpAcceptLanguage = $session;
        } else {
            $httpAcceptLanguage = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? config('app.locale') ?? 'pt-BR';
        }

        $languages = explode(',', $httpAcceptLanguage);
        $result = [];
        foreach ($languages as $language) {
            $lang = explode(';q=', $language);
            $result[$lang[0]] = isset($lang[1]) ? floatval($lang[1]) : 1;
        }

        arsort($result);

        $primeiroIdiomaSuportado = array_key_first($result);

        $idiomaFinal = null;

        if (! self::verificaIdiomaSuportado($primeiroIdiomaSuportado)) { //se idioma não é suportado
            $idiomaFinal = $this->idiomaPadrao;
        } elseif (empty($primeiroIdiomaSuportado)) { //se idioma não é identificado no browser
            $idiomaFinal = $this->idiomaPadrao;
        } else {
            $idiomaFinal = $primeiroIdiomaSuportado;
        }

        $idiomaNoFormatoLaravel = self::formataIdiomaPadraoLaravel($idiomaFinal);

        app()->setLocale($idiomaNoFormatoLaravel);

        if (Session::isStarted()) {
            Session::put('lang', app()->getLocale());
        }

        return $next($request);
    }
}
