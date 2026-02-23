<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $locale = $request->get('locale', Language::where('is_default', true)->value('code') ?? 'tr');
        $language = Language::where('code', $locale)->where('is_active', true)->first();
        if (! $language) {
            abort(404);
        }

        $posts = Post::query()
            ->with('category')
            ->where('language_id', $language->id)
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/blog', [
            'posts' => $posts,
            'locale' => $locale,
            'languages' => Language::where('is_active', true)->get(),
        ]);
    }

    public function show(Request $request, string $slug): Response|HttpResponse
    {
        $locale = $request->get('locale', Language::where('is_default', true)->value('code') ?? 'tr');
        $language = Language::where('code', $locale)->where('is_active', true)->first();
        if (! $language) {
            abort(404);
        }

        $post = Post::query()
            ->with(['category', 'relatedPosts'])
            ->where('slug', $slug)
            ->where('language_id', $language->id)
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->first();

        if (! $post) {
            abort(404);
        }

        return Inertia::render('public/post', [
            'post' => $post,
            'locale' => $locale,
            'languages' => Language::where('is_active', true)->get(),
        ]);
    }
}
