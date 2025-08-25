<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;


class InventorySummary extends Model
{
    protected $fillable = [
        'school_id',
        'user_id',
        'total_quantity',
        'downloaded_psf_per_sub',
        'disbursed_amount',
        'pdf_document'
    ];

    protected $casts = [
        'downloaded_psf_per_sub' => 'decimal:2',
        'disbursed_amount' => 'decimal:2',
        'total_quantity' => 'integer',
    ];

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id', 'school_id');
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getPdfUrlAttribute()
    {
        return $this->pdf_document
            ? Storage::url($this->pdf_document)
            : null;
    }   

    public function hasPdfDocument()
    {
        return $this->pdf_document && Storage::disk('public')->exists($this->pdf_document);
    }


    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($summary) {
            if ($summary->pdf_document && Storage::disk('public')->exists($summary->pdf_document)) {
                Storage::disk('public')->delete($summary->pdf_document);
            }
        });
    }

}
