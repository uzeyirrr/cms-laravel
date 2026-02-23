<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Page;
use App\Models\Post;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $base = config('app.url');
        $languages = Language::where('is_active', true)->get();
        $xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        $xml .= '<url><loc>'.e($base).'/</loc><changefreq>daily</changefreq></url>';

        foreach ($languages as $lang) {
            Page::query()
                ->where('language_id', $lang->id)
                ->where('status', 'published')
                ->each(function (Page $page) use (&$xml, $base, $lang) {
                    $xml .= '<url><loc>'.e($base.'/sayfa/'.$page->slug.'?locale='.$lang->code).'</loc><changefreq>weekly</changefreq></url>';
                });

            Post::query()
                ->where('language_id', $lang->id)
                ->where('status', 'published')
                ->whereNotNull('published_at')
                ->each(function (Post $post) use (&$xml, $base, $lang) {
                    $xml .= '<url><loc>'.e($base.'/blog/'.$post->slug.'?locale='.$lang->code).'</loc><changefreq>weekly</changefreq></url>';
                });
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
            'Charset' => 'UTF-8',
        ]);
    }
}
