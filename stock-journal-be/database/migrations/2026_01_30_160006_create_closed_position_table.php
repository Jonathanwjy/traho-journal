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
        Schema::create('closed_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_id')->constrained('stocks')->onDelete('cascade');
            $table->string('name', 4);
            $table->double('buy_price');
            $table->double('sell_price');
            $table->integer('lot_size');
            $table->date('buy_date');
            $table->date('close_date');
            $table->string('action')->nullable();
            $table->double('realized_gain')->nullable();
            $table->text('reason')->nullable();
            $table->double('percentage_gain')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('closed_position');
    }
};
