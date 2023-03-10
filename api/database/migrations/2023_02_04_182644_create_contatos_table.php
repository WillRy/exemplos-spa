<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contatos', function (Blueprint $table) {
            $table->id();
            $table->string('nome', 255);
            $table->string('email', 255)->unique();
            $table->string('telefone', 255)->nullable();
            $table->string('cep', 255)->nullable();
            $table->string('endereco', 255)->nullable();
            $table->string('numero', 255)->nullable();
            $table->string('bairro', 255)->nullable();
            $table->string('complemento', 255)->nullable();
            $table->string('cidade', 255)->nullable();
            $table->string('estado', 255)->nullable();

            $table->bigInteger('organizacao_id')->unsigned()->nullable();
            $table->foreign('organizacao_id')->references('id')->on('organizacoes');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contatos');
    }
};
