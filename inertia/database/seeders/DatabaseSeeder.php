<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call(UsuarioSeeder::class);

        $tags = ['teste1', 'teste2', 'teste2'];
        $tagsCriadas = [];
        foreach ($tags as $tag) {
            $tagCriada = \App\Models\Tag::create([
                'nome' => $tag,
                'cor_fundo' => '#000',
                'cor_texto' => '#fff',
            ]);
            $tagsCriadas[] = $tagCriada->id;
        }

        $organizacoes = ['teste1', 'teste2', 'teste2'];
        $organizacoesCriadas = [];
        foreach ($organizacoes as $organizacao) {
            $rand= rand(1, 1000);
            $organizacaoCriada = \App\Models\Organizacao::create([
                'nome' => $organizacao,
                'email' => "{$rand}@teste.com",
                'telefone' => '1234567890',
                'cep' => '12345678',
            ]);

            $organizacoesCriadas[] = $organizacaoCriada;

            $organizacaoCriada->tags()->attach($tagCriada);

            $contatos = ['teste4', 'teste5', 'teste6'];
            $contatosCriados = [];
            foreach ($contatos as $contato) {
                $rand= rand(1, 1000);
                $contatoCriado =  \App\Models\Contato::create([
                    'nome' => $contato,
                    'email' => "{$rand}@{$organizacao}.com",
                    'telefone' => '1234567890',
                    'cep' => '12345678',
                    'organizacao_id' => $organizacaoCriada->id,
                ]);

            }
        }
    }
}
