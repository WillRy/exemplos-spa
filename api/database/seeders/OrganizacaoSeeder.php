<?php

namespace Database\Seeders;

use App\Models\Contato;
use App\Models\Organizacao;
use Illuminate\Database\Seeder;

class OrganizacaoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Organizacao::factory(60)->create();
    }
}
