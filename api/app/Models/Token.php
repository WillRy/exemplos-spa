<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'expira_em',
        'usuario_id',
    ];

    protected $table = 'tokens';

    public function usuario(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id');
    }

    public function validaToken(int $idUsuario, string $token)
    {
        $tokenValido = $this
            ->where('usuario_id', $idUsuario)
            ->where('token', $token)
            ->where('expira_em', '>=', date('Y-m-d H:i:s'))
            ->first();

        self::where('token', $token)->delete();

        return $tokenValido;
    }

    public function gerarToken(int $idUsuario, $segundos = 60)
    {
        $criado = self::create([
            'token' => \Illuminate\Support\Str::random(16),
            'usuario_id' => $idUsuario,
            'expira_em' => date('Y-m-d H:i:s', strtotime("+{$segundos}seconds")),
        ]);

        return $criado->token;
    }

    public function tokenComUsuario(string $token)
    {
        return Token::where('token', $token)->with('usuario')->first();
    }
}
