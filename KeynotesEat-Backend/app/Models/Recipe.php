<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // <--- TAMBAHKAN BARIS INI
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory; 

    protected $fillable = ['title', 'name', 'description', 'ingredients', 'steps', 'image_url', 'waktu', 'kesulitan'];
}