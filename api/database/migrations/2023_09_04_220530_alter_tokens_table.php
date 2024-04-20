<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('token_autenticacao', function (Blueprint $table) {
            $table->unsignedBigInteger('id_token_session');
            $table->foreign('id_token_session')->references('id')->on('token_sessions')->onDelete('CASCADE');
        });
        Schema::table('refresh_token', function (Blueprint $table) {
            $table->unsignedBigInteger('id_token_session');
            $table->foreign('id_token_session')->references('id')->on('token_sessions')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('token_autenticacao', function (Blueprint $table) {
            $table->dropConstrainedForeignId('id_token_session');
        });
        Schema::table('refresh_token', function (Blueprint $table) {
            $table->dropConstrainedForeignId('id_token_session');
        });
    }
};
