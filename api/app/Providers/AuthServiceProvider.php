<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\AuthGuard\UsuariosProvider;
use App\Models\Usuario;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Foundation\Application;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        /** Registrar uma auth guard personalizada */
        Auth::provider('usuarios', function (Application $app, array $config) {

            return new UsuariosProvider(
                Usuario::class,
                'id',
                'email',
                'senha'
            );
        });
    }
}
