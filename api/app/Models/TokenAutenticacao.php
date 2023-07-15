<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TokenAutenticacao extends Model
{
    use HasFactory;

    protected $table = "token_autenticacao";

    protected $primaryKey = 'id';

    protected $fillable = [
        'usuario_id',
        'token',
        'refresh_token',
        'token_expiracao',
        'refresh_token_expiracao',
        'criado_em'
    ];

    public $timestamps = false;

    const SEGUNDOS_TOLERANCIA_REFRESH = 60;


    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id');
    }


    public function gerarToken(
        int $idUsuario
    )
    {
        return auth('api')->setTTL(60)->tokenById($idUsuario);
    }


    public function gerarRefreshToken()
    {
        return Str::random(64);
    }

    public function salvarTodosTokens(
        int $idUsuario
    )
    {
        $tokensGerados = new \stdClass();

        $tokensGerados->token = $this->gerarToken($idUsuario);
        $tokensGerados->refresh_token = $this->gerarRefreshToken();

        $refreshId = DB::table('refresh_token')
            ->insertGetId([
                'usuario_id' => $idUsuario,
                'token' => $tokensGerados->refresh_token,
                'token_expiracao' => date('Y-m-d H:i:s', strtotime("+7hour")),
            ]);

        DB::table('token_autenticacao')
            ->insert([
                'usuario_id' => $idUsuario,
                'token' => $tokensGerados->token,
                'token_expiracao' => date('Y-m-d H:i:s', strtotime("+1hour")),
                'refresh_id' => $refreshId
            ]);


        return $tokensGerados;
    }


    public function tokenValido(
        string $token
    )
    {
        $token = self::query()
            ->selectRaw("
            *,
            (token_expiracao < DATE_ADD(NOW(), INTERVAL ? SECOND)) as expirado
        ", [TokenAutenticacao::SEGUNDOS_TOLERANCIA_REFRESH])
            ->where('token', '=', $token)
            ->first();

        $tokenValido = !empty($token) && empty($token->expirado);

        return $tokenValido;
    }


    public function retornaExpiracaoToken(string $token)
    {
        $jwtParts = explode('.', $token);
        $jwtPayload = base64_decode($jwtParts[1]);
        $payload = json_decode($jwtPayload);
        return $payload->exp ? \DateTimeImmutable::createFromFormat('U', $payload->exp)->format('Y-m-d H:i:s') : null;
    }

    public function refreshToken(
        string $refreshToken
    )
    {
        $informacaoToken = DB::table("refresh_token")
            ->selectRaw("
              *,
              (token_expiracao < DATE_ADD(NOW(), INTERVAL ? SECOND)) as expirado
            ", [TokenAutenticacao::SEGUNDOS_TOLERANCIA_REFRESH])
            ->where('token', '=', $refreshToken)
            ->first();

        $refreshTokenValido = !empty($informacaoToken) && empty($informacaoToken->expirado);

        if (!$refreshTokenValido) {
            throw new \Exception("Invalid refresh token");
        }

        $tokensGerados = new \stdClass();
        $tokensGerados->token = $this->gerarToken($informacaoToken->usuario_id);
        $tokensGerados->refresh_token = $this->gerarRefreshToken();

        $expiracaoRefreshToken = date('Y-m-d H:i:s', strtotime("+7hour"));
        $expiracaoToken = $this->retornaExpiracaoToken($tokensGerados->token);


        DB::table('refresh_token')
            ->where([
                'id' => $informacaoToken->id,
            ])
            ->update([
                'token' => $tokensGerados->refresh_token,
                'token_expiracao' => $expiracaoRefreshToken,
            ]);

        DB::table('token_autenticacao')
            ->where([
                'refresh_id' => $informacaoToken->id,
            ])
            ->update([
                'token' => $tokensGerados->token,
                'token_expiracao' => $expiracaoToken
            ]);


        return $tokensGerados;

    }

    public function excluirRegistroDeTokenPorTokenPrincipal(string $token)
    {
        return self::query()
            ->where('token', '=', $token)
            ->delete();
    }

    public function logoutTokens()
    {
        Auth::guard()->logout();

        $token = Cookie::get('token');

        setcookie('token', null, -1, '/', null, null, true);
        setcookie('refresh_token', null, -1, '/', null, null, true);

        if ($token) {
            $this->excluirRegistroDeTokenPorTokenPrincipal($token);
        }


    }
}
