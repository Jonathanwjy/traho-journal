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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', length: 4);
            $table->double('buy_price');
            $table->double('average_price');
            $table->integer('lot_size');
            $table->date('buy_date');
            $table->integer('leverage')->nullable();
            $table->enum('action', ['long', 'short'])->default('long');
            $table->string('conviction')->nullable();
            $table->double('sell_price')->nullable();
            $table->double('realized_earn')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
