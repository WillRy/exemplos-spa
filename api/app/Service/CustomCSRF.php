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

    public static $cookieName = 'CSRF-TOKEN';

    public static $headerName = 'CSRF-TOKEN';

    public static $hash = '';

    const COOKIE_SAME_SITE = 'none';

    const SIGNATURE = 'NCJDWCWO8U8922FMCDNCIUDWO84928';

    public function __construct()
    {
        $this->iniciarCSRF();
    }

    public function setCookie(string $name, string $value, bool $forceExpire = false, bool $httpOnly = true)
    {
        setcookie($name, $value, [
            'expires' => $forceExpire ? time() - 3600 : time() + 3600,
            'path' => '/',
            'secure' => true,
            'httponly' => $httpOnly,
            'samesite' => self::COOKIE_SAME_SITE,
        ]);
    }

    public function sessionIsStarted()
    {
        if (! Session::isStarted()) {
            return Session::start();
        }

        if (session_status() === PHP_SESSION_NONE) {
            return session_start();
        }
    }

    public function generateToken()
    {
        if ($this->csrfType === self::TYPE_SESSION) {
            $this->sessionIsStarted();

            if (session()->has('unique_token')) {
                return session()->get('unique_token');
            }

            $random = Str::random(60);
            session()->put('unique_token', $random);

            return $random;
        } else {
            $random = ! empty($_COOKIE[self::$cookieName]) ? $_COOKIE[self::$cookieName] : Str::random(60);
            $this->setCookie(self::$cookieName, $random, false, false);

            return $random;
        }

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
        $method = strtoupper($_SERVER['REQUEST_METHOD']);
        $methodsToProtect = ['POST', 'PUT', 'DELETE', 'PATCH'];
        if (! in_array($method, $methodsToProtect, true)) {
            return false;
        }

        //protects only browser requests
        if (! $this->hasOrigin()) {
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
        return $this->generateToken();
    }

    /**
     * Inicializa a proteção de CSRF
     * somente se necessário
     */
    public function iniciarCSRF(): string
    {
        return $this->generateToken();
    }

    /**
     * CSRF customizado
     *
     * Para ter CSRF para a API SOMENTE QUANDO estiver em browser
     * e não ter CSRF quando chamado via API diretamente
     */
    public function tratarCSRF()
    {
        if (! $this->shouldCheckCSRF()) {
            return true;
        }

        $postedCsrf = $this->getPostedCSRF();

        $serverCSRF = $this->getServerCSRF();

        if (empty($postedCsrf) || empty($serverCSRF)) {
            throw new \Exception('CSRF Token inválido!', 419);
        }

        $checkCsrf = hash_equals($postedCsrf, $serverCSRF);

        if (! $checkCsrf) {
            throw new \Exception('CSRF Token inválido!', 419);
        }

        return true;
    }
}
