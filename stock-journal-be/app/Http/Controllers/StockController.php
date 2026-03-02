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
            $query->orderBy('note_date', 'desc');
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

        $hasAveraging = $stock->notes()
            ->whereIn('type', ['avg_up', 'avg_down'])
            ->exists();

        if ($hasAveraging && ($request->has('buy_price') || $request->has('lot_size'))) {
            return response()->json([
                'success' => false,
                'message' => 'Data saham ini sudah tidak bisa di edit karena sudah ada riwayat averaging'
            ], 422);
        }

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

        if ($request->has('buy_price') || $request->has('lot_size')) {
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

        $validator = Validator::make($request->all(), [
            'lot'         => 'required|integer|min:1',
            'sell_price' => 'required|numeric|min:1',
            'close_date'  => 'required|date',
            'reason'      => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $stock = Stock::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        if ($request->lot > $stock->lot_size) {
            return response()->json([
                'success' => false,
                'errors'  => [
                    'lot' => ['Jumlah lot melebihi sisa yang dimiliki (Maksimal: ' . $stock->lot_size . ')']
                ]
            ], 422);
        }

        $buyPrice      = $stock->average_price;
        $sellPrice     = $request->sell_price;
        $lotToClose    = $request->lot;

        $realizedGain  = ($sellPrice - $buyPrice) * $lotToClose * 100;

        $percentageGain = ($buyPrice > 0) ? (($sellPrice - $buyPrice) / $buyPrice) * 100 : 0;

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

        $remainingLot = $stock->lot_size - $lotToClose;

        if ($remainingLot <= 0) {
            $stock->update([
                'lot_size' => 0,
                'balance'  => 0,
                'status'   => 'close'
            ]);
        } else {
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
        $user = JWTAuth::parseToken()->authenticate();

        $closedPositions = ClosedPosition::whereHas('stock', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->orderBy('close_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil daftar posisi tertutup',
            'data' => $closedPositions
        ]);
    }
}
