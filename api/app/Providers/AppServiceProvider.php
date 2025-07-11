<?php

namespace App\Providers;

use App\AuthGuard\JwtGuard;
use App\AuthGuard\UsuariosProvider;
use App\Models\Usuario;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (! $this->app->runningInConsole()) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        Auth::extend('jwt2', function ($app, $name, array $config) {
            // Retorna uma instância de App\AuthGuard\JwtGuard...
            return new JwtGuard(Auth::createUserProvider($config['provider']), $app['request']);
        });

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
