<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/reviews/{media_type}/{media_id}', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::delete('/review/{review}', [ReviewController::class, 'destroy']);
Route::put('/review/{review}', [ReviewController::class, 'update']);
Route::get('/review/{review}', [ReviewController::class, 'show']);
Route::post('/comments', [CommentController::class, 'store']);
Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
Route::put('/comments/{comment}', [CommentController::class, 'update']);

Route::get('/favorites', [FavoriteController::class, 'index']);
Route::post('/favorites', [FavoriteController::class, 'toggleFavorite']);
Route::get('/favorites/status', [FavoriteController::class, 'checkFavoriteStatus']);
