<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{

    protected $fillable = [
        'user_id',
        'stock_id',
        'type',
        'note_date',
        'price',
        'content',
        'lot',

    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }
}
