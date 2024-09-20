<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //

        $validated = $request->validate([
            'content' => 'required|string|max:200',
            'review_id' => 'required|integer|exists:reviews,id',
        ]);

   $comment = Comment::create([
        'content' => $validated['content'],
        'review_id' => $validated['review_id'],
        'user_id' => Auth::user()->id,
   ]);




$comment->load('user');

return response()->json($comment);

   }





 

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
    

if(Auth::user()->id !== $comment->user_id){
    return response()->json(['message' => '権限がありません。'], 401       );
}

$validated = $request->validate([
    'content' => 'required|string|max:200',
]);

$comment->update([
    'content' => $validated['content'],
]);
return response()->json($comment);









    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {


        $comment->delete();

return response()->json(['message' => 'コメントが削除されました。']);



    }
}
