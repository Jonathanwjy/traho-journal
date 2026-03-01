<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Stock;
use App\Models\Note;

class NotesController extends Controller
{

    public function store(Request $request, $stock)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($request->all(), [
            'type'      => 'required|in:avg_up,avg_down,note',
            'price'     => 'required_unless:type,note|nullable|numeric|min:1',
            'content'   => 'required',
            'lot'       => 'required_unless:type,note|nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        // 🔒 ambil stock dari URL + pastikan milik user login
        $stock = Stock::where('id', $stock)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if (!$stock) {
            return response()->json([
                'success' => false,
                'message' => 'Stock tidak ditemukan atau bukan milik Anda'
            ], 404);
        }

        $note = Note::create([
            'user_id'   => $user->id,
            'stock_id'  => $stock->id,
            'type'      => $request->type,
            'note_date' => $request->note_date ?? now()->toDateString(),
            'price'     => $request->price,
            'lot'       => $request->lot,
            'content'   => $request->content,
        ]);

        if (
            in_array($request->type, ['avg_up', 'avg_down']) &&
            $request->price
        ) {
            // ambil semua harga avg (termasuk avg awal stock)
            $avgCount = $stock->notes()
                ->whereIn('type', ['avg_up', 'avg_down'])
                ->whereNotNull('price')
                ->count();

            // hitung lot size baru
            $newLotSize = $stock->lot_size + ($request->lot ?? 0);

            // masukkan average_price awal stock sebagai data pertama
            $currentBalance = $stock->balance ?? 0; // Ambil saldo saat ini di DB
            $newTransactionValue = $request->price * $request->lot * 100;
            $updatedBalance = $currentBalance + $newTransactionValue;

            // hitung average price baru
            $newAveragePrice = $updatedBalance / ($newLotSize * 100);

            $stock->update([
                'average_price' => $newAveragePrice,
                'lot_size' => $newLotSize,
                'balance' => $updatedBalance,
            ]);
        }


        return response()->json([
            'success' => true,
            'message' => 'Note berhasil ditambahkan',
            'data'    => $note,
        ], 201);
    }

    // Hapus $stockId dari parameter, cukup $id (note id) saja
    public function update(Request $request, $id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        // 1. VALIDASI (Sama seperti sebelumnya)
        $validator = Validator::make($request->all(), [
            'type'      => 'required|in:avg_up,avg_down,note',
            'price'     => 'required_unless:type,note|nullable|numeric|min:1',
            'lot'       => 'required_unless:type,note|nullable|integer|min:1',
            'content'   => 'required|string',
            'note_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        // =========================================================
        // PERBAIKAN DI SINI (LOGIC PENGAMBILAN DATA)
        // =========================================================

        // 1. Cari Note dulu (karena kita cuma punya $id note dari URL)
        // Pastikan note ini milik user yang sedang login agar aman
        $note = Note::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        // 2. Otomatis dapatkan Stock berdasarkan stock_id yang tersimpan di Note
        $stock = Stock::where('id', $note->stock_id)->where('user_id', $user->id)->firstOrFail();

        // =========================================================
        // LOGIKA SETERUSNYA SAMA PERSIS (TIDAK PERLU DIUBAH)
        // =========================================================

        // TAHAP 1: UNDO (Batalkan efek Note Lama pada Stock)
        $currentStockLot     = $stock->lot_size;
        $currentStockBalance = $stock->balance;

        if (in_array($note->type, ['avg_up', 'avg_down'])) {
            $oldTransactionValue = $note->price * $note->lot * 100;
            $currentStockLot     -= $note->lot;
            $currentStockBalance -= $oldTransactionValue;
        }

        // TAHAP 2: UPDATE DATA NOTE
        $note->update([
            'type'      => $request->type,
            'note_date' => $request->note_date ?? $note->note_date,
            'price'     => $request->type === 'note' ? null : $request->price,
            'lot'       => $request->type === 'note' ? null : $request->lot,
            'content'   => $request->content,
        ]);

        // TAHAP 3: REDO (Terapkan efek Note Baru pada Stock)
        if (in_array($request->type, ['avg_up', 'avg_down'])) {
            $newTransactionValue = $request->price * $request->lot * 100;
            $currentStockLot     += $request->lot;
            $currentStockBalance += $newTransactionValue;
        }

        // TAHAP 4: HITUNG FINAL AVERAGE & SIMPAN
        $finalAvgPrice = 0;
        if ($currentStockLot > 0) {
            $finalAvgPrice = $currentStockBalance / ($currentStockLot * 100);
        }

        $stock->update([
            'lot_size'      => $currentStockLot,
            'balance'       => $currentStockBalance,
            'average_price' => $finalAvgPrice,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Catatan berhasil diperbarui',
            'data'    => $note,
        ], 200);
    }

    public function index($stock)
    {
        $user = JWTAuth::parseToken()->authenticate();

        // 🔒 ambil stock dari URL + pastikan milik user login
        $stock = Stock::where('id', $stock)
            ->where('user_id', $user->id)
            ->first();

        if (!$stock) {
            return response()->json([
                'success' => false,
                'message' => 'Stock tidak ditemukan atau bukan milik Anda'
            ], 404);
        }

        $notes = Note::where('stock_id', $stock->id)
            ->where('user_id', $user->id)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $notes,
        ]);
    }
}
