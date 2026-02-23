<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PageController extends Controller
{
    public function show(Request $request, string $slug): Response|HttpResponse
    {
        $locale = $request->get('locale', Language::where('is_default', true)->value('code') ?? 'tr');
        $language = Language::where('code', $locale)->where('is_active', true)->first();
        if (! $language) {
            abort(404);
        }

        $page = Page::query()
            ->where('slug', $slug)
            ->where('language_id', $language->id)
            ->where('status', 'published')
            ->first();

        if (! $page) {
            abort(404);
        }

        return Inertia::render('public/page', [
            'page' => $page,
            'locale' => $locale,
            'languages' => Language::where('is_active', true)->get(),
        ]);
    }
}
