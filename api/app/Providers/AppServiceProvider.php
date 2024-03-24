<?php

namespace App\Providers;

use App\AuthGuard\UsuariosProvider;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Foundation\Application;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        if(!$this->app->runningInConsole()) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(): void
    {
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
