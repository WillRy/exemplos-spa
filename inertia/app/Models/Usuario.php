<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Request;
use Laravel\Sanctum\HasApiTokens;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;


    protected $table = "usuarios";

    protected $fillable = [
        'nome',
        'email',
        'senha',
    ];

    protected $hidden = [
        'senha',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function getAuthPassword()
    {
        return $this->senha;
    }

    public function tokens()
    {
        return $this->hasMany(Token::class, 'usuario_id', 'id');
    }


    public function retornarCookieToken(string $token)
    {
        return setcookie('token', $token, [
            'expires' => time() + 86400,
            'path' => '/',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    public function removerCookieToken()
    {
        return setcookie('token', '', [
            'expires' => -1,
            'path' => '/',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
    }

    public static function jwt()
    {
        $tokenHeader = Request::bearerToken() ?? null;
        $cookie = !empty($_COOKIE['token']) ? $_COOKIE['token'] : null;
        return $tokenHeader ?? $cookie;
    }
}
