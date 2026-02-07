<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\StockController;
use App\Http\Middleware\JWTMiddleware;
use App\Http\Controllers\NotesController;
use App\Http\Controllers\StatController;

use App\Models\Stock;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::post('register', [JWTAuthController::class, 'register']);
    Route::post('login', [JWTAuthController::class, 'login']);

    Route::middleware(JWTMiddleware::class)->group(function () {
        Route::post('logout', [JWTAuthController::class, 'logout']);
        Route::post('change-password', [JWTAuthController::class, 'changePassword']);
        Route::get('/profile', [JWTAuthController::class, 'profile']);

        Route::prefix('stocks')->group(function () {
            Route::post('/store', [StockController::class, 'store']);
            Route::get('/index', [StockController::class, 'index']);
            Route::post('/{id}/close', [StockController::class, 'close']);
            Route::patch('/{id}/update', [StockController::class, 'update']);
            Route::get('/{id}/show', [StockController::class, 'show']);

            //notes
            Route::post('/{stock}/notes', [NotesController::class, 'store']);
            Route::get('/{stock}/notes', [NotesController::class, 'index']);
        });


        Route::prefix('notes')->group(function () {
            Route::patch('/{id}', [NotesController::class, 'update']);
        });

        Route::prefix('stats')->group(function () {
            Route::post('/refresh', [StatController::class, 'updateUserStats']);
            Route::get('/show', [StatController::class, 'show']);
            Route::get('/index', [StatController::class, 'index']);
            Route::get('/detail/{id}', [StatController::class, 'detail_closed_position']);
            Route::get('/growth', [StatController::class, 'getGrowthChart']);
        });
    });
});
