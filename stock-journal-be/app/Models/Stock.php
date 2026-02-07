<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Note;
use App\Models\ClosedPosition;

class Stock extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'buy_price',
        'average_price',
        'lot_size',
        'buy_date',
        'action',
        'conviction',
        'balance',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function closedPositions()
    {
        return $this->hasMany(ClosedPosition::class);
    }
}
