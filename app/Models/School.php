<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class School extends Model
{
    use HasFactory;

    protected $fillable = ['region', 'division', 'school_id', 'school_name', 'created_at', 'updated_at'];


    public function summaries()
    {
        return $this->hasOne(InventorySummary::class, 'school_id', 'school_id');
    }
    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'school_id', 'school_id')
            ->with(['item', 'sport']);
    }

}
