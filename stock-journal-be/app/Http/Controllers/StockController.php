<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\ClosedPosition;
use App\Http\Controllers\StatController;

class StockController extends Controller
{
    public function index()
    {
        $stocks = Stock::where('user_id', Auth::id())->orderBy('buy_date', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $stocks
        ]);
    }

    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:4',
            'buy_price' => 'required|numeric|min:1',
            'average_price' => 'numeric',
            'lot_size' => 'required|integer|min:1',
            'buy_date' => 'required|date',
            'leverage' => 'nullable|integer',
            'action' => 'in:long,short',
            'conviction' => 'nullable|string',
            'status' => 'in:open,close',
            'balance' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $buy_price = $request->buy_price;
        $lot = $request->lot_size;
        $balance = $buy_price * $lot * 100;

        $stock = Stock::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'buy_price' => $buy_price,
            'average_price' => $request->buy_price,
            'lot_size' => $lot,
            'buy_date' => $request->buy_date,
            'action' => $request->action,
            'conviction' => $request->conviction,
            'balance' => $balance,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Stock created successfully',
            'data' => $stock
        ], 201);
    }

    public function show($id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $stock = Stock::with(['notes' => function ($query) {
            $query->orderBy('note_date', 'desc'); // Menampilkan note terbaru di atas
        }])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$stock) {
            return response()->json([
                'success' => false,
                'message' => 'Data stock tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail stock dan notes berhasil diambil',
            'data' => $stock
        ]);
    }

    public function update(Request $request, $id)
    {
        // ... validator tetap sama ...
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:4',
            'buy_price' => 'sometimes|required|numeric|min:1',
            'lot_size' => 'sometimes|required|integer|min:1',
            'buy_date' => 'sometimes|required|date',
            'leverage' => 'sometimes|nullable|integer',
            'action' => 'sometimes|in:long,short',
            'conviction' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:open,close',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $stock = Stock::findOrFail($id);

        if ($stock->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // 1. Cek apakah sudah ada riwayat averaging (avg_up atau avg_down)
        $hasAveraging = $stock->notes()
            ->whereIn('type', ['avg_up', 'avg_down'])
            ->exists();

        // 2. Proteksi: Jika ada averaging, dilarang ubah buy_price atau lot_size
        if ($hasAveraging && ($request->has('buy_price') || $request->has('lot_size'))) {
            return response()->json([
                'success' => false,
                'message' => 'Data saham ini sudah tidak bisa di edit karena sudah ada riwayat averaging'
            ], 422);
        }

        // 3. Ambil input atau gunakan data lama
        $currentPrice = $request->input('buy_price', $stock->buy_price);
        $currentLot   = $request->input('lot_size', $stock->lot_size);

        $updateData = $request->only([
            'name',
            'buy_price',
            'lot_size',
            'buy_date',
            'leverage',
            'action',
            'conviction',
            'status'
        ]);

        // 4. Update data (Hanya masuk sini jika tidak melanggar proteksi di atas)
        if ($request->has('buy_price') || $request->has('lot_size')) {
            // Karena sudah diproteksi, berarti ini adalah update untuk stock yang BELUM averaging
            $updateData['average_price'] = $currentPrice;
            $updateData['balance'] = $currentPrice * $currentLot * 100;
        }

        $stock->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Stock berhasil diupdate',
            'data' => $stock
        ]);
    }

    public function close(Request $request, $id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'lot'         => 'required|integer|min:1',
            'sell_price' => 'required|numeric|min:1',
            'close_date'  => 'required|date',
            'reason'      => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // 2. Ambil data Stock (pastikan milik user)
        $stock = Stock::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        // Proteksi: Pastikan lot yang di-close tidak melebihi lot yang dimiliki
        if ($request->lot > $stock->lot_size) {
            return response()->json([
                'success' => false,
                'errors'  => [
                    'lot' => ['Jumlah lot melebihi sisa yang dimiliki (Maksimal: ' . $stock->lot_size . ')']
                ]
            ], 422);
        }

        // 3. Logika Perhitungan Finansial
        $buyPrice      = $stock->average_price; // Menggunakan harga rata-rata sebagai acuan beli
        $sellPrice     = $request->sell_price;
        $lotToClose    = $request->lot;

        // Realized Gain = (Harga Jual - Harga Beli) * Lot * 100
        $realizedGain  = ($sellPrice - $buyPrice) * $lotToClose * 100;

        // Percentage Gain = ((Harga Jual - Harga Beli) / Harga Beli) * 100
        $percentageGain = ($buyPrice > 0) ? (($sellPrice - $buyPrice) / $buyPrice) * 100 : 0;

        // 4. Simpan ke tabel closed_positions
        $closedPosition = ClosedPosition::create([
            'stock_id'        => $stock->id,
            'name'            => $stock->name,
            'buy_price'       => $buyPrice,
            'sell_price'      => $sellPrice,
            'lot_size'        => $lotToClose,
            'buy_date'        => $stock->buy_date,
            'close_date'      => $request->close_date,
            'action'          => $stock->action,
            'realized_gain'   => round($realizedGain, 2),
            'reason'          => $request->reason,
            'percentage_gain' => round($percentageGain, 2),
        ]);

        // 5. Update tabel Stock
        $remainingLot = $stock->lot_size - $lotToClose;

        if ($remainingLot <= 0) {
            // Jika lot habis, ubah status atau hapus stock (sesuai kebutuhan Anda)
            $stock->update([
                'lot_size' => 0,
                'balance'  => 0,
                'status'   => 'close'
            ]);
        } else {
            // Jika masih ada sisa, kurangi lot dan kurangi balance berdasarkan porsi lot yang dijual
            // Balance baru = Harga rata-rata * Sisa Lot * 100
            $newBalance = $stock->average_price * $remainingLot * 100;

            $stock->update([
                'lot_size' => $remainingLot,
                'balance'  => $newBalance
            ]);
        }


        return response()->json([
            'success' => true,
            'message' => 'Posisi berhasil ditutup',
            'data'    => $closedPosition
        ]);
    }

    public function jaja()
    {
        // 1. Ambil user yang sedang login
        $user = JWTAuth::parseToken()->authenticate();

        // 2. Ambil semua closed positions yang terhubung dengan stocks milik user tersebut
        $closedPositions = ClosedPosition::whereHas('stock', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->orderBy('close_date', 'desc') // Urutkan dari yang paling baru ditutup
            ->get();

        // 3. Return response JSON
        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil daftar posisi tertutup',
            'data' => $closedPositions
        ]);
    }
}
