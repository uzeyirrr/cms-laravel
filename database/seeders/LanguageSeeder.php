<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        Language::firstOrCreate(
            ['code' => 'tr'],
            ['name' => 'Türkçe', 'is_default' => true, 'is_active' => true]
        );
        Language::firstOrCreate(
            ['code' => 'en'],
            ['name' => 'English', 'is_default' => false, 'is_active' => true]
        );
    }
}
