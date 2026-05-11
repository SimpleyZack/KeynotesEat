<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('ingredients');
            $table->text('steps');
            $table->string('image_url')->nullable();
            $table->string('name');
            $table->text('description');
            $table->string('title')->nullable();
            $table->integer('waktu')->nullable();
        $table->string('level')->default('Mudah');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
