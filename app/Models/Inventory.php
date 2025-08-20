<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = [
        'school_id',
        'user_id',
        'sport_id',
        'item_id',
        'quantity',
        'isShow',
        'downloaded_psf_per_sub',
        'disbursed_amount'
    ];

    public function sport()
    {
        return $this->belongsTo(Sport::class, 'sport_id');
    }

    public function item()
    {
        return $this->belongsTo(SportItem::class, 'item_id');
    }

    public function itemSport()
    {
        return $this->hasOneThrough(
            Sport::class,
            SportItem::class,
            'id',        // foreign key on SportItem table
            'id',        // foreign key on Sport table
            'item_id',   // local key on Inventory table
            'sport_id'   // local key on SportItem table
        );
    }
}
