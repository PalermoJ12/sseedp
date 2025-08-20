<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventory_summaries', function (Blueprint $table) {
            $table->id();
            // match your current schema (users/inventories use string school_id)
            $table->string('school_id', 55);
            $table->unsignedBigInteger('user_id');
            $table->unsignedInteger('total_quantity');
            $table->decimal('downloaded_psf_per_sub', 10, 2);
            $table->decimal('disbursed_amount', 15, 2);
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_summary');
    }
};
