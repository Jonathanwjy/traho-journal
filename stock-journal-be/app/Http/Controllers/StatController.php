<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Stock;
use App\Models\ClosedPosition;
use App\Models\Stat;
use App\Models\Note;

class StatController extends Controller
{

    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $closedPositions = ClosedPosition::whereHas('stock', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->orderBy('close_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'List riwayat transaksi berhasil diambil',
            'data'    => $closedPositions
        ]);
    }

    public function show()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $stat = Stat::where('user_id', $user->id)->first();

        if (!$stat) {
            return response()->json([
                'success' => true,
                'message' => 'Statistik belum tersedia',
                'data' => [
                    'total_trades' => 0,
                    'total_win' => 0,
                    'total_loss' => 0,
                    'realized_gain' => 0,
                    'realized_profit' => 0,
                    'realized_loss' => 0,
                    'win_rate' => 0,
                    'total_balance' => 0
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data statistik',
            'data' => $stat
        ]);
    }

    public function updateUserStats()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        $allClosed = ClosedPosition::whereHas('stock', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        $totalTrades = $allClosed->count();
        $totalWin    = $allClosed->where('realized_gain', '>', 0)->count();
        $totalLoss   = $allClosed->where('realized_gain', '<', 0)->count();

        $realizedEarn = $allClosed->where('realized_gain', '>', 0)->sum('realized_gain');
        $realizedLoss   = $allClosed->where('realized_gain', '<', 0)->sum('realized_gain');
        $totalRealized  = $allClosed->sum('realized_gain');

        $winRate = ($totalTrades > 0) ? ($totalWin / $totalTrades) * 100 : 0;

        $totalBalance = Stock::where('user_id', $userId)
            ->where('status', 'open')
            ->sum('balance');


        $stat = Stat::updateOrCreate(
            ['user_id' => $userId],
            [
                'total_trades'    => $totalTrades,
                'total_win'       => $totalWin,
                'total_loss'      => $totalLoss,
                'realized_earn'   => $totalRealized,
                'realized_profit' => $realizedEarn,
                'realized_loss'   => $realizedLoss,
                'win_rate'        => round($winRate, 2),
                'total_balance'   => $totalBalance,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Statistik berhasil diperbarui',
            'data'    => $stat
        ], 200);
    }

    public function detail_closed_position($id)
    {

        $closed = ClosedPosition::with('stock')
            ->where('id', $id)
            ->first();

        if (!$closed) {
            return response()->json([
                'success' => false,
                'message' => 'Data Closed Position tidak ditemukan atau bukan milik Anda'
            ], 404);
        }

        $notes = [];
        if ($closed->stock_id) {
            $notes = Note::where('stock_id', $closed->stock_id)
                ->orderBy('note_date', 'desc')
                ->get();
        }

        return response()->json([
            'success' => true,
            'data'    => $closed,
            'notes'   => $notes,
        ]);
    }

    public function getGrowthChart()
    {
        $userId = JWTAuth::parseToken()->authenticate()->id;

        $growthData = ClosedPosition::whereHas('stock', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->whereYear('close_date', date('Y'))
            ->selectRaw('MONTH(close_date) as month, SUM(realized_gain) as total_gain')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $formattedData = collect(range(1, 12))->map(function ($m) use ($growthData) {
            $found = $growthData->firstWhere('month', $m);
            return [
                'name' => date('M', mktime(0, 0, 0, $m, 1)),
                'total' => $found ? (float)$found->total_gain : 0
            ];
        });

        return response()->json(['data' => $formattedData]);
    }
}
