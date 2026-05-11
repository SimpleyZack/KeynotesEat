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
    // Validasi sederhana biar datanya nggak ngaco
    $request->validate([
        'title' => 'required',
        'name' => 'required',
        'description' => 'required',
    ]);

    // Masukkan data ke database
    $recipe = Recipe::create([
    'title' => $request->title,
    'name' => $request->name,
    'description' => $request->description,
    'ingredients' => $request->ingredients,
    'steps' => $request->steps,
    'image_url' => $request->image_url,
    'waktu' => $request->waktu, // Tambah ini
    'level' => $request->level, // Tambah ini
    ]);
    // Kasih jawaban ke Postman kalau sukses
    return response()->json([
        'message' => 'Resep berhasil ditambah, imoett!',
        'data' => $recipe
    ], 201);
}
}