<?php

namespace App\Service;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use stdClass;

class Autenticacao
{
    // usado para gerar graceful period do token
    const SEGUNDOS_TOLERANCIA_REFRESH = 30;
    const SEGUNDOS_ACCESS_TOKEN_VALIDO = 3600; //1 hour
    const SEGUNDOS_REFRESH_TOKEN_VALIDO = 25200; //7 hours
    const SEGUNDOS_RETORNAR_TOKENS_AINDA_VALIDOS = 300; //5 minutes


    public function gerarTokenJwt(
        int $idUsuario
    ): string {
        return auth('api')->setTTL(60)->tokenById($idUsuario);
    }

    public function gerarRefreshToken(): string
    {
        return Str::random(64);
    }


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


        return $tokensGerados;
    }

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

    public function retornaExpiracaoToken(string $token): ?string
    {
        $jwtParts = explode('.', $token);
        $jwtPayload = base64_decode($jwtParts[1]);
        $payload = json_decode($jwtPayload);
        return $payload->exp ? \DateTimeImmutable::createFromFormat('U', $payload->exp)->format('Y-m-d H:i:s') : null;
    }

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

        if(empty($tokenFilhoValido)) {

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



        return $tokensGerados;
    }

    public function excluirRegistroDeTokenPorTokenPrincipal(string $token): bool
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

    public function logoutTokens(): void
    {
        Auth::guard()->logout();

        $token = Request::bearerToken() ?? Cookie::get('token');

        setcookie('token', null, -1, '/', null, null, true);
        setcookie('refresh_token', null, -1, '/', null, null, true);

        if ($token) {
            $this->excluirRegistroDeTokenPorTokenPrincipal($token);
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

    public function retornaRefreshTokenAindaValido(int $tokenSessionId)
    {
        return DB::table('refresh_token')
            ->where('id_token_session', '=', $tokenSessionId)
            ->whereRaw('TIMESTAMPDIFF(SECOND, NOW(), token_expiracao) > 60')
            ->first();
    }

    public function retornaAccessTokenAindaValido(int $tokenSessionId)
    {
        return DB::table('token_autenticacao')
            ->where('id_token_session', '=', $tokenSessionId)
            ->whereRaw('TIMESTAMPDIFF(SECOND, NOW(), token_expiracao) > 60')
            ->first();
    }

    public function retornaRefreshFilhoAindaValido(int $idRefreshPai)
    {
        return DB::table('refresh_token')
            ->where('refresh_id_pai', '=', $idRefreshPai)
            ->whereRaw('(token_expiracao > now())')
            ->orderBy('id','desc')
            ->first();
    }
}
