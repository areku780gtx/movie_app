<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($media_type, $media_id)
    {
      $reviews = Review::with('user')->where('media_type', $media_type)->where('media_id', $media_id)->get();
      return response()->json($reviews);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        

$review=$request->input('content');
$validatedData = $request->validate([
    'rating' => 'required|integer',
    'media_type' => 'required|string',
    'media_id' => 'required|integer',
    'content' => 'required|string',
]);

$review = Review::create([
    'rating' => $validatedData['rating'],
    'media_type' => $validatedData['media_type'],
    'media_id' => $validatedData['media_id'],
    "content" => $validatedData['content'],
    "user_id" => 1,
]);
$review->load('user');
return response()->json($review);
    }
    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //

        $review->load('user', 'comments.user');
        return response()->json($review);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        //

        $validatedData = $request->validate([
            'rating' => 'required|integer',

            'content' => 'required|string',
        ]);

$review->update([
    'rating' => $validatedData['rating'],
    'content' => $validatedData['content'],
]);




return response()->json($review);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
try{


       $review->delete();
       return response()->json(['message' => '正常にレビューが削除されました']);





    }catch(\Exception $e){
        return response()->json(['message' => 'レビュー削除エラー', 'error' => $e->getMessage()], 500);
    }
}
}
