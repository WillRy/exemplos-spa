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
            $table->bigInteger('refresh_id')->unsigned()->nullable();
            $table->foreign('refresh_id')->references('id')->on('refresh_token')->onDelete('CASCADE');
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
            $table->dropConstrainedForeignId('refresh_id');
        });
    }
};
