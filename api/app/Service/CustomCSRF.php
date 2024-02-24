<?php

namespace App\Service;

use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class CustomCSRF
{
    const CSRF_HASH_BYTES = 16;

    const TYPE_COOKIE = 'cookie';

    const TYPE_SESSION = 'session';

    protected $csrfType = 'cookie'; // 'session' or 'cookie

    public static $cookieName = 'XSRF-TOKEN';

    public static $headerName = 'X-XSRF-TOKEN';

    public static $hash = '';


    public function __construct()
    {
        $this->generateCSRF();
    }


    public function setCookie(string $name, string $value, bool $forceExpire = false, bool $httpOnly = true)
    {
        setcookie($name, $value, [
            'expires' => $forceExpire ? time() - 3600 : time() + 3600,
            'path' => '/',
            'domain' => null,
            'secure' => true,
            'httponly' => $httpOnly,
            'samesite' => 'Lax'
        ]);
    }



    public function sessionIsStarted()
    {
        if (!Session::isStarted()) {
            return Session::start();
        }

        if (session_status() === PHP_SESSION_NONE) {
            return session_start();
        }
    }

    public function generateSessionToken()
    {

        if (session()->has('unique_token')) {
            return session()->get('unique_token');
        }

        $random = Str::random(60);
        session()->put('unique_token', $random);
        return $random;
    }

    public function hasOrigin(): bool
    {
        return isset($_SERVER['HTTP_ORIGIN']);
    }


    /**
     * Verifica se deve ou não proteger a request com CSRF
     */
    public function shouldCheckCSRF()
    {
        // Protects POST, PUT, DELETE, PATCH
        $method           = strtoupper($_SERVER['REQUEST_METHOD']);
        $methodsToProtect = ['POST', 'PUT', 'DELETE', 'PATCH'];
        if (!in_array($method, $methodsToProtect, true)) {
            return false;
        }

        //protects only browser requests
        if (!$this->hasOrigin()) {
            return false;
        }

        return true;
    }

    /**
     * Retorna o csrf token que o usuário informou na request
     */
    public function getPostedCSRF()
    {
        $headerName = str_replace('-', '_', strtoupper(self::$headerName));

        $csrf = $_SERVER["HTTP_{$headerName}"] ?? null;

        if (empty($csrf)) {
            $csrf = filter_input(INPUT_POST, 'csrf_token') ?? null;
        }

        return $csrf;
    }

    /**
     * Retorna o csrf token que o servidor
     * usa para comparar posteriormente com o do usuário
     */
    public function getServerCSRF()
    {
        if ($this->csrfType === self::TYPE_COOKIE) {
            return hash_hmac('sha256', $this->generateSessionToken(), env('APP_KEY'));
        }

        return session()->get('csrf');
    }

    /**
     * Gera o csrf token e salva na sessão ou cookie
     */
    public function generateCSRF()
    {
        self::$hash = hash_hmac('sha256', $this->generateSessionToken(), env('APP_KEY'));

        if ($this->csrfType === self::TYPE_COOKIE) {

            $this->setCookie(self::$cookieName, self::$hash, false, false);

            return self::$hash;
        }

        session()->put('csrf', self::$hash);

        return self::$hash;
    }



    /**
     * Inicializa a proteção de CSRF
     * somente se necessário
     */
    public function iniciarCSRF(): string
    {

        $this->sessionIsStarted();

        $this->generateCSRF();

        if ($this->csrfType === self::TYPE_SESSION) {
            $csrf = $this->getServerCSRF();
        } else {
            $csrf = $this->getPostedCSRF();
        }

        return $csrf;
    }

    /**
     * CSRF customizado
     *
     * Para ter CSRF para a API SOMENTE QUANDO estiver em browser
     * e não ter CSRF quando chamado via API diretamente
     */
    public function tratarCSRF()
    {
        if (!$this->shouldCheckCSRF()) {
            return true;
        }


        $this->sessionIsStarted();

        $postedCsrf = $this->getPostedCSRF();

        $serverCSRF = $this->getServerCSRF();

        if (empty($postedCsrf) || empty($serverCSRF)) {
            throw new \Exception("CSRF Token inválido!", 419);
        }


        $checkCsrf = hash_equals($postedCsrf, $serverCSRF);

        if (!$checkCsrf) {
            throw new \Exception("CSRF Token inválido!", 419);
        }

        return true;
    }
}
