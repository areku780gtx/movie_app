<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
class FavoriteController extends Controller
{









    public function toggleFavorite(Request $request)
    {
        $validatedData = $request->validate([
            'media_type' => 'required|string',
            'media_id' => 'required|string',
        ]);

        $existingFavorite = Favorite::where('user_id', Auth::id())
            ->where('media_type', $validatedData['media_type'])
            ->where('media_id', $validatedData['media_id'])
            ->first();

        if ($existingFavorite) {
            $existingFavorite->delete();
            return response()->json(["status" => "removed"]);

        } else {

            Favorite::create([
               'media_type' => $validatedData['media_type'],
                'media_id' => $validatedData['media_id'],
                'user_id' => Auth::id(),
            ]);
            return response()->json(["status" => "added"]);
        }

    }
    public function checkFavoriteStatus(Request $request)
    {
        $validatedData = $request->validate([
            'media_type' => 'required|string',
            'media_id' => 'required|string',
        ]);
        
        $isFavorite = Favorite::where('user_id', Auth::id())
            ->where('media_type', $validatedData['media_type'])
            ->where('media_id', $validatedData['media_id'])
            ->exists();

       return response()->json($isFavorite);


    }



    /**
     * Display a listing of the resource.
     */
    public function index()
    {
 
$api_key = config('services.tmdb.api_key');
$user=Auth::user();
$favorites=$user->favorites;
$details=[];
foreach($favorites as $favorite){

    $tmdb_api_key="https://api.themoviedb.org/3/" . $favorite->media_type . "/" . $favorite->media_id . "?api_key=" . $api_key;
   
   
   
    $response=Http::get($tmdb_api_key);

if($response->successful()){

    



    $details[]=array_merge($response->json(),['media_type'=>$favorite->media_type]);
   

}

}




return response()->json($details);




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
    }

    /**
     * Display the specified resource.
     */
    public function show(Favorite $favorite)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Favorite $favorite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Favorite $favorite)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Favorite $favorite)
    {
        //
    }
}
