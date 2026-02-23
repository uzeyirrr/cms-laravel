<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Page;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(Request $request): Response
    {
        $locale = $request->get('locale', Language::where('is_default', true)->value('code') ?? 'tr');
        $language = Language::where('code', $locale)->where('is_active', true)->first() ?? Language::where('is_active', true)->first();
        $q = $request->input('q', '');

        $pages = collect();
        $posts = collect();
        if (strlen($q) >= 2 && $language) {
            $pages = Page::query()
                ->where('language_id', $language->id)
                ->where('status', 'published')
                ->where(fn ($query) => $query->where('title', 'like', "%{$q}%")->orWhere('body', 'like', "%{$q}%"))
                ->limit(10)
                ->get();
            $posts = Post::query()
                ->where('language_id', $language->id)
                ->where('status', 'published')
                ->where(fn ($query) => $query->where('title', 'like', "%{$q}%")->orWhere('body', 'like', "%{$q}%"))
                ->limit(10)
                ->get();
        }

        return Inertia::render('public/search', [
            'q' => $q,
            'pages' => $pages,
            'posts' => $posts,
            'locale' => $language?->code ?? 'tr',
            'languages' => Language::where('is_active', true)->get(),
        ]);
    }
}
