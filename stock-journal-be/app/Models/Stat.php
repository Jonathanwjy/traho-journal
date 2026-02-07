<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stat extends Model
{

    protected $fillable = [
        'user_id',
        'total_trades',
        'total_win',
        'total_loss',
        'realized_earn',
        'total_balance',
        'realized_loss',
        'realized_profit',
        'win_rate'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
