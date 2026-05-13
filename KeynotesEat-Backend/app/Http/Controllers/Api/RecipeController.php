<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Recipe; // <--- Pastikan baris ini ADA

class RecipeController extends Controller {
    public function index() {
        $recipes = Recipe::all();
        return response()->json($recipes);
    }
public function store(Request $request) 
{
    try {
        $imageUrl = '';

        if ($request->hasFile('image_file')) {
            // 1. Simpan file ke 'images' di dalam disk 'public' 
            // Ini otomatis akan masuk ke storage/app/public/images
            $path = $request->file('image_file')->store('images', 'public');
            
            // 2. Buat URL-nya menggunakan asset() agar sesuai dengan APP_URL di .env
            $imageUrl = asset('storage/' . $path);
        } 
        else if ($request->filled('image_url')) {
            $imageUrl = $request->image_url;
        }

        $recipe = Recipe::create([
            'title'       => $request->title,
            'name'        => $request->name,
            'description' => $request->description ?? '-',
            'ingredients' => $request->ingredients ?? '-',
            'steps'       => $request->steps ?? '-',
            'image_url'   => $imageUrl,
            'waktu'       => (int) ($request->waktu ?? 0),
            'level'       => $request->level ?? 'Mudah',
        ]);

        return response()->json([
            'message' => 'Resep berhasil ditambah, imoett!',
            'data' => $recipe
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Gagal simpan nih!',
            'error' => $e->getMessage()
        ], 500);
    }
}
}