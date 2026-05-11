<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
{
    \App\Models\Recipe::create([
        'title'       => 'Nasi Goreng Spesial',
        'name'        => 'Nasi Goreng Spesial',
        'description' => 'Nasi goreng enak buatan Aqila',
        'ingredients' => 'Nasi, Telur, Kecap',
        'steps'       => '1. Panaskan minyak, 2. Goreng telur, 3. Masukkan nasi.', // <--- TAMBAHKAN INI
        'image_url'   => 'nasi_goreng.jpg', // Opsional, sesuaikan kolom migrasimu
    ]);
}
}
    }

