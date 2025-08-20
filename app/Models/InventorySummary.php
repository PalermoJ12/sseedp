<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventorySummary extends Model
{
    protected $fillable = [
        'school_id',
        'user_id',
        'total_quantity',
        'downloaded_psf_per_sub',
        'disbursed_amount',
    ];

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
