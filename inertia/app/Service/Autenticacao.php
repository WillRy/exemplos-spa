<?php

namespace App\Service;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use stdClass;

class Autenticacao
{
    // usado para gerar graceful period do token
    const SEGUNDOS_TOLERANCIA_REFRESH = 30;
    const SEGUNDOS_ACCESS_TOKEN_VALIDO = 3600; //1 hour
    const SEGUNDOS_REFRESH_TOKEN_VALIDO = 25200; //7 hours
    const SEGUNDOS_RETORNAR_TOKENS_AINDA_VALIDOS = 300; //5 minutes

    const SECRET_KEY = "748e6c60fb51c9b9a388e18ee1803a11ab67d8a32fda9094e7487996b15dbf0e";


    /**
     * Gerar token JWT de autenticação
     */
    public function gerarTokenJwt(
        int $idUsuario
    ): string {
        return auth('api')->setTTL(60)->tokenById($idUsuario);
    }


    /**
     * Gerar o refresh token no modelo opaco
     */
    public function gerarRefreshToken(): string
    {
        return Str::random(64);
    }

    public function setCookie(string $name, string $value, bool $forceExpire = false)
    {
        setcookie($name, $value, [
            'expires' => $forceExpire ? time() - 3600 : null,
            'path' => '/',
            'domain' => null,
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
    }

    /**
     * Registra a autenticação do usuário
     * armazenando os tokens no banco e
     * retornando os tokens gerados
     */
    public function gerarAutenticacao(
        int $idUsuario
    ): stdClass {

        $idTokenSession = DB::table("token_sessions")->insertGetId([
            'user_id' => $idUsuario,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $tokensGerados = new \stdClass();
        $tokensGerados->session = DB::table("token_sessions")->where('id', $idTokenSession)->first();
        $tokensGerados->token = $this->gerarTokenJwt($idUsuario);
        $tokensGerados->refresh_token = $this->gerarRefreshToken();

        $refreshId = DB::table('refresh_token')
            ->insertGetId([
                'id_token_session' => $idTokenSession,
                'usuario_id' => $idUsuario,
                'token' => $tokensGerados->refresh_token,
                'token_expiracao' => date('Y-m-d H:i:s', strtotime("+" . self::SEGUNDOS_REFRESH_TOKEN_VALIDO . "seconds")),
            ]);

        DB::table('token_autenticacao')
            ->insert([
                'id_token_session' => $idTokenSession,
                'usuario_id' => $idUsuario,
                'token' => $tokensGerados->token,
                'token_expiracao' => date('Y-m-d H:i:s', strtotime("+" . self::SEGUNDOS_ACCESS_TOKEN_VALIDO . "seconds")),
                'refresh_id' => $refreshId
            ]);

        $this->setCookie('token', $tokensGerados->token);
        $this->setCookie('refresh_token', $tokensGerados->refresh_token);

        return $tokensGerados;
    }

    /**
     * Verifica se usuários estão válidos
     */
    public function isLogged(string $token): bool
    {
        $isTokenValid = $this->tokenValido($token);
        $isCSRFValid = $this->tratarCSRF();

        return $isTokenValid && $isCSRFValid;
    }


    /**
     * Verifica se o token de autenticação é válido
     */
    public function tokenValido(
        string $token
    ): bool {
        $token = DB::table('token_autenticacao')
            ->selectRaw("
                *,
                (token_expiracao < ?) as expirado
                ", [now()])
            ->where('token', '=', $token)
            ->first();

        $tokenValido = !empty($token) && $token->expirado  === 0;

        return $tokenValido;
    }

    /**
     * Retorna a expiração do token JWT
     */
    public function retornaExpiracaoToken(string $token): ?string
    {
        $jwtParts = explode('.', $token);
        $jwtPayload = base64_decode($jwtParts[1]);
        $payload = json_decode($jwtPayload);
        return $payload->exp ? \DateTimeImmutable::createFromFormat('U', $payload->exp)->format('Y-m-d H:i:s') : null;
    }


    /**
     * Realiza o processo de refresh token, contemplando:
     * - Verificação de token expirado
     * - Geração de novo token
     * - Geração de novo refresh token
     * - Inativação do token antigo
     * - Inativação do refresh token antigo
     *
     */
    public function refreshToken(
        string $refreshToken
    ): stdClass {
        $this->removerTokensExpirados();

        $informacaoToken = DB::table("refresh_token")
            ->selectRaw("
              *,
              (token_expiracao < ?) as expirado
              ", [now()])
            ->where('token', '=', $refreshToken)
            ->first();

        $refreshTokenValido = !empty($informacaoToken) && $informacaoToken->expirado === 0;

        if (!$refreshTokenValido) {
            throw new \Exception("Invalid refresh token");
        }

        $idTokenSession = $informacaoToken->id_token_session;

        $tokensGerados = new \stdClass();

        $tokenFilhoValido = $this->retornaRefreshFilhoAindaValido($informacaoToken->id);

        if (empty($tokenFilhoValido)) {

            $tokensGerados->refresh_token = $this->gerarRefreshToken();

            $expiracaoRefreshToken = date('Y-m-d H:i:s', strtotime("+7hour"));


            $refreshTokenId = DB::table('refresh_token')
                ->insertGetId([
                    'id_token_session' => $idTokenSession,
                    'usuario_id' => $informacaoToken->usuario_id,
                    'token' => $tokensGerados->refresh_token,
                    'token_expiracao' => $expiracaoRefreshToken,
                    'refresh_id_pai' =>  $informacaoToken->id
                ]);
        } else {
            $tokensGerados->refresh_token = $tokenFilhoValido->token;
            $refreshTokenId = $tokenFilhoValido->id;
        }

        $tokensGerados->token = $this->gerarTokenJwt($informacaoToken->usuario_id);
        $expiracaoToken = $this->retornaExpiracaoToken($tokensGerados->token);


        DB::table('token_autenticacao')
            ->insert([
                'id_token_session' => $idTokenSession,
                'usuario_id' => $informacaoToken->usuario_id,
                'token' => $tokensGerados->token,
                'token_expiracao' => $expiracaoToken,
                'refresh_id' => $refreshTokenId
            ]);

        if (empty($informacaoToken->usado_em)) {
            //invalidate old token with graceful period to avoid race conditions
            DB::table('refresh_token')
                ->where([
                    'id' => $informacaoToken->id,
                ])
                ->update([
                    'usado_em' => date('Y-m-d H:i:s'),
                    'token_expiracao' => now()->addSeconds(self::SEGUNDOS_TOLERANCIA_REFRESH),
                ]);
        }


        $this->setCookie('token', $tokensGerados->token);
        $this->setCookie('refresh_token', $tokensGerados->refresh_token);

        return $tokensGerados;
    }


    /**
     * Faz logout do usuário com base em um token
     */
    public function excluirLoginPorToken(string $token): bool
    {
        $token = DB::table('token_autenticacao')
            ->where('token', '=', $token)
            ->first();

        if (empty($token)) {
            return false;
        }

        return DB::table('token_sessions')
            ->where('id', '=', $token->id_token_session)
            ->delete();
    }

    /**
     * Força o logout limpando os tokens
     */
    public function logoutTokens(): void
    {
        Auth::guard()->logout();

        $token = Request::bearerToken() ?? Cookie::get('token');


        //set cookie lax
        $this->setCookie('token', '', true);
        $this->setCookie('refresh_token', '', true);
        $this->setCookie('X-CSRF-TOKEN', '', true);


        if ($token) {
            $this->excluirLoginPorToken($token);
        }
    }

    public function removerTokensExpirados(): void
    {
        DB::table("refresh_token")
            ->whereRaw('(token_expiracao < ?)', [now()])
            ->delete();

        DB::table("token_autenticacao")
            ->whereRaw('(token_expiracao < ?)', [now()])
            ->delete();
    }

    public function removerTokensPorSession(int $tokenSessionId): void
    {
        DB::table("refresh_token")
            ->where('id_token_session', '=', $tokenSessionId)
            ->delete();

        DB::table("token_autenticacao")
            ->where('id_token_session', '=', $tokenSessionId)
            ->delete();
    }

    public function retornaRefreshFilhoAindaValido(int $idRefreshPai): ?object
    {
        return DB::table('refresh_token')
            ->where('refresh_id_pai', '=', $idRefreshPai)
            ->whereRaw('(token_expiracao > now())')
            ->orderBy('id', 'desc')
            ->first();
    }

    public function getCurrentSessionId(): ?int
    {
        $token = $this->tokenRequest();

        if (empty($token)) {
            return null;
        }

        $token = DB::table('token_autenticacao')
            ->where('token', '=', $token)
            ->first();

        if (empty($token)) {
            return null;
        }

        return $token->id_token_session;
    }

    public static function tokenRequest(): ?string
    {
        return Request::bearerToken() ?? Cookie::get('token');
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

    public function hasOrigin(): bool
    {
        return isset($_SERVER['HTTP_ORIGIN']);
    }

    /**
     * Indica se deve usar sessão ou cookie para o CSRF
     */
    public function useSession()
    {
        return false;
    }

    /**
     * Verifica se deve ou não proteger a request
     * com CSRF
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

        //protects only if user is logged in
        if (!$this->getCurrentSessionId()) {
            return false;
        }

        return true;
    }

    /**
     * Retorna o csrf token que o usuário informou na request
     */
    public function getPostedCSRF()
    {
        $csrf = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;

        if (empty($csrf)) {
            $csrf = $_COOKIE['X-CSRF-TOKEN'] ?? null;
        }

        if (empty($csrf)) {
            $csrf = $_REQUEST['csrf_token'] ?? null;
        }

        return $csrf;
    }

    /**
     * Retorna o csrf token que o servidor
     * usa para comparar posteriormente com o do usuário
     */
    public function getServerCSRF()
    {
        if (!$this->useSession()) {
            return hash_hmac('sha256', $this->getCurrentSessionId(), self::SECRET_KEY);
        }

        return session()->get('csrf');
    }

    /**
     * Gera o csrf token e salva na sessão ou cookie
     */
    public function generateCSRF()
    {
        $csrf = null;

        if (!$this->useSession()) {
            $csrf = hash_hmac('sha256', $this->getCurrentSessionId(), self::SECRET_KEY);

            $this->setCookie('X-CSRF-TOKEN', $csrf);

            return $csrf;
        }

        $csrf = md5(uniqid(rand(), true));

        session()->put('csrf', $csrf);

        return $csrf;
    }



    /**
     * Inicializa a proteção de CSRF
     * somente se necessário
     */
    public function iniciarCSRF(): string
    {

        $this->sessionIsStarted();

        if ($this->useSession()) {
            $csrf = $this->getServerCSRF();
        } else {
            $csrf = $this->getPostedCSRF();
        }

        if (empty($csrf)) {
            $csrf = $this->generateCSRF();
            return $csrf;
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


        $checkCsrf = $postedCsrf === $serverCSRF;

        if (!$checkCsrf) {
            throw new \Exception("CSRF Token inválido!", 419);
        }

        return true;
    }
}
