<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SportItem extends Model
{
   use HasFactory;

    protected $fillable = ['sport_id', 'item_name', 'created_at','updated_at'];

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }
}
