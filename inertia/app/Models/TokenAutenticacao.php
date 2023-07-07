<?php

namespace App\Models;

use Auth;
use Cookie;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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




    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id');
    }


    public function gerarToken(
        int $idUsuario
    ) {
        return auth('api')->setTTL(60)->tokenById($idUsuario);
    }


    public function gerarRefreshToken(
        int $idUsuario
    ) {
        return auth('api')->setTTL(420)->tokenById($idUsuario);
    }

    public function salvarTodosTokens(
        int $idUsuario
    ) {
        $tokensGerados = new \stdClass();

        $tokensGerados->token = $this->gerarToken($idUsuario);
        $tokensGerados->refresh_token = $this->gerarRefreshToken($idUsuario);

        self::create([
            'usuario_id' => $idUsuario,
            'token' => $tokensGerados->token,
            'refresh_token' => $tokensGerados->refresh_token,
            'token_expiracao' => date('Y-m-d H:i:s', strtotime("+1hour")),
            'refresh_token_expiracao' => date('Y-m-d H:i:s', strtotime("+7hour")),
        ]);

        return $tokensGerados;
    }

    public function atualizarTokenRegerado(
        int $id,
        string $token
    ) {
        return self::query()->where('id', $id)->update([
            'token' => $token,
            'token_expiracao' => date('Y-m-d H:i:s', strtotime("+1hour")),
        ]);
    }


    public function tokenValido(
        string $token
    ) {
        $token = self::query()
            ->selectRaw("
            *,
            (token_expiracao < NOW()) as expirado
        ")
            ->where('token', '=', $token)
            ->first();

        $tokenValido = !empty($token) && empty($token->expirado);

        return $tokenValido;
    }

    public function refreshToken(
        string $refreshToken
    ) {
        $informacaoToken = self::query()
            ->selectRaw("
            *,
            (refresh_token_expiracao < NOW()) as expirado
        ")
            ->where('refresh_token', '=', $refreshToken)
            ->first();

        $refreshTokenValido = !empty($informacaoToken) && empty($informacaoToken->expirado);

        if (!$refreshTokenValido) {
            throw new \Exception("Invalid refresh token");
        }

        $tokensGerados = new \stdClass();

        $tokensGerados->token = $this->gerarToken($informacaoToken->usuario_id);


        $this->atualizarTokenRegerado($informacaoToken->id, $tokensGerados->token);



        return $tokensGerados;

    }

    public function excluirRegistroDeTokenPorTokenPrincipal(
        string $token
    ) {
        return self::query()
            ->where('token', '=', $token)
            ->delete();
    }

    public function logoutTokens($token = null)
    {
        Auth::guard()->logout();

        setcookie('token', null, -1, '/', null, null, true);
        setcookie('refresh_token', null, -1, '/', null, null, true);

        if($token) {
            $this->excluirRegistroDeTokenPorTokenPrincipal($token);
        }


    }
}
