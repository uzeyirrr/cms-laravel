<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $locale = request()->get('locale', Language::where('is_default', true)->value('code') ?? 'tr');
        $language = Language::where('code', $locale)->where('is_active', true)->first() ?? Language::where('is_active', true)->first();

        return Inertia::render('public/home', [
            'locale' => $language?->code ?? 'tr',
            'languages' => Language::where('is_active', true)->get(),
        ]);
    }
}
