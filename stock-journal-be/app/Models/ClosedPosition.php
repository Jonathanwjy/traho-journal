<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Stock;

class ClosedPosition extends Model
{
    protected $fillable = [
        'stock_id',
        'name',
        'buy_price',
        'sell_price',
        'lot_size',
        'buy_date',
        'close_date',
        'action',
        'realized_gain',
        'reason',
        'percentage_gain',
    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }
}
