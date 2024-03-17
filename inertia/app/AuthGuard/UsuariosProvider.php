<?php


namespace App\AuthGuard;


use App\Models\Usuario;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Support\Facades\Hash;

class UsuariosProvider implements UserProvider
{

    protected $referenciaClasseModel;
    protected $nomeCampoID;
    protected $nomeCampoLogin;
    protected $nomeCampoSenha;

    public function __construct(
        $referenciaClasseModel,
        $nomeCampoID,
        $nomeCampoLogin,
        $nomeCampoSenha
    )
    {
        $this->referenciaClasseModel = $referenciaClasseModel;
        $this->nomeCampoID = $nomeCampoID;
        $this->nomeCampoLogin = $nomeCampoLogin;
        $this->nomeCampoSenha = $nomeCampoSenha;
    }

    /**
     * Busca o usuário pelo ID
     *
     * @param mixed $identifier
     * @return mixed
     */
    public function retrieveById($identifier)
    {
        return (new $this->referenciaClasseModel)->where($this->nomeCampoID, $identifier)->first();
    }

    public function retrieveByToken($identifier, $token)
    {
        return null;
    }

    public function updateRememberToken(Authenticatable $user, $token)
    {
        return null;
    }

    /**
     * Busca o usuário por um array de credenciais(campos)
     *
     * @param mixed $identifier
     * @return mixed
     */
    public function retrieveByCredentials(array $credentials)
    {
        $senha = !empty($credentials[$this->nomeCampoSenha]) ? $credentials[$this->nomeCampoSenha] : null;

        if (empty($senha)) return null;

        unset($credentials[$this->nomeCampoSenha]);

        $usuario = (new $this->referenciaClasseModel)->where($credentials)->first();

        if (empty($usuario)) return null;

        $senhaEstaValida = Hash::check($senha, $usuario[$this->nomeCampoSenha]);

        if (!$senhaEstaValida) return null;

        return $usuario;
    }

    /**
     * Valida se o usuario logado está com as credenciais válidas
     *
     * @param mixed $identifier
     * @return mixed
     */
    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        $senhaInformada = !empty($credentials[$this->nomeCampoSenha]) ? $credentials[$this->nomeCampoSenha] : null;
        $senhaUsuarioLogado = !empty($user->{$this->nomeCampoSenha}) ? $user->{$this->nomeCampoSenha} : null;

        return Hash::check($senhaInformada, $senhaUsuarioLogado);
    }

    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false)
    {
        return null;
    }
}
