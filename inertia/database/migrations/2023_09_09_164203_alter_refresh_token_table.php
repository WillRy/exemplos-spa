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
        Schema::table('refresh_token', function (Blueprint $table) {
            $table->dateTime('usado_em')->nullable();
            $table->unsignedBigInteger('refresh_id_pai')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('refresh_token', function (Blueprint $table) {
            $table->dropColumn('usado_em');
            $table->dropColumn('refresh_id_pai');
        });
    }
};
