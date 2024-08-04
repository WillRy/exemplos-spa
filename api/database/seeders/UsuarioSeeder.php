<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run()
    {

        Usuario::create([
            'nome' => 'Administrador',
            'email' => 'admin@admin.com',
            'senha' => Hash::make('123456'),
        ]);
    }
}
