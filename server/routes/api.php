<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CommentController;
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

