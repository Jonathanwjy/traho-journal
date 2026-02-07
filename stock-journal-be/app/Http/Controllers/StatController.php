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

    public function index(Request $request)
    {
        // 1. Ambil User dari Token JWT
        $user = JWTAuth::parseToken()->authenticate();

        $closedPositions = ClosedPosition::whereHas('stock', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->orderBy('close_date', 'desc')->get(); // Urutkan dari tanggal close terbaru


        // 3. Return JSON Response
        return response()->json([
            'success' => true,
            'message' => 'List riwayat transaksi berhasil diambil',
            'data'    => $closedPositions
        ]);
    }

    public function show()
    {
        // 1. Ambil data user dari token JWT
        $user = JWTAuth::parseToken()->authenticate();

        // 2. Cari data statistik berdasarkan user_id
        $stat = Stat::where('user_id', $user->id)->first();

        // 3. Jika data belum ada (misal user baru yang belum pernah close posisi)
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

        // 4. Return data statistik
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
        // 1. Ambil semua posisi yang sudah ditutup melalui relasi Stock
        $allClosed = ClosedPosition::whereHas('stock', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        // 2. Hitung Metrik Dasar
        $totalTrades = $allClosed->count();
        $totalWin    = $allClosed->where('realized_gain', '>', 0)->count();
        $totalLoss   = $allClosed->where('realized_gain', '<', 0)->count();

        // 3. Hitung Nominal Profit & Loss
        $realizedEarn = $allClosed->where('realized_gain', '>', 0)->sum('realized_gain');
        $realizedLoss   = $allClosed->where('realized_gain', '<', 0)->sum('realized_gain');
        $totalRealized  = $allClosed->sum('realized_gain');

        // 4. Hitung Win Rate (Persentase)
        $winRate = ($totalTrades > 0) ? ($totalWin / $totalTrades) * 100 : 0;

        // 5. Hitung Total Balance (Modal yang masih 'floating' di saham yang sedang open)
        $totalBalance = Stock::where('user_id', $userId)
            ->where('status', 'open')
            ->sum('balance');

        // 6. Update atau Create data di tabel Stats
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
        $closed = ClosedPosition::with('stock')->orderBy('close_date', 'desc')->findOrFail($id);

        $notes = [];
        if ($closed->stock_id) {
            $notes = Note::where('stock_id', $closed->stock_id)
                ->orderBy('note_date')
                ->get();
        }

        return response()->json([
            'data' => $closed,
            'notes' => $notes,
        ]);
    }

    // StatController.php
    public function getGrowthChart()
    {
        $userId = JWTAuth::parseToken()->authenticate()->id;

        // Mengambil data gain berdasarkan bulan di tahun berjalan
        $growthData = ClosedPosition::whereHas('stock', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->whereYear('close_date', date('Y'))
            ->selectRaw('MONTH(close_date) as month, SUM(realized_gain) as total_gain')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Mapping angka bulan ke nama bulan singkat (Jan, Feb, dst)
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
