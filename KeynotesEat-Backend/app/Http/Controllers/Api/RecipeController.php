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
        // Kita tangkap semua data, tapi paksa default kalau kosong
        $recipe = Recipe::create([
            'title'       => $request->title,
            'name'        => $request->name,
            'description' => $request->description ?? '-',
            'ingredients' => $request->ingredients ?? '-',
            'steps'       => $request->steps ?? '-',
            'image_url'   => $request->image_url ?? '',
            'waktu'       => (int) ($request->waktu ?? 0), // Paksa jadi angka
            'level'       => $request->level ?? 'Mudah',
        ]);

        return response()->json([
            'message' => 'Resep berhasil ditambah, imoett!',
            'data' => $recipe
        ], 201);

    } catch (\Exception $e) {
        // Kalau error, Laravel bakal ngasih tau kenapa daripada cuma angka 500
        return response()->json([
            'message' => 'Gagal simpan nih!',
            'error' => $e->getMessage()
        ], 500);
    }
}
}