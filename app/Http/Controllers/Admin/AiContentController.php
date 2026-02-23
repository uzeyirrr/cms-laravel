<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Services\AiContentService;
use App\Services\AiTranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiContentController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('accessAdmin');

        return Inertia::render('admin/ai/content/index', [
            'preset_title' => $request->query('preset_title', ''),
            'languages' => Language::where('is_active', true)->get(['id', 'code', 'name']),
        ]);
    }

    public function metaTitle(Request $request, AiTranslationService $translation): JsonResponse
    {
        $this->authorize('accessAdmin');

        $request->validate([
            'content' => ['required', 'string', 'max:50000'],
        ]);

        $content = $translation->generateMetaTitle($request->input('content'));

        return response()->json(['meta_title' => $content]);
    }

    public function metaDescription(Request $request, AiTranslationService $translation): JsonResponse
    {
        $this->authorize('accessAdmin');

        $request->validate([
            'content' => ['required', 'string', 'max:50000'],
        ]);

        $content = $translation->generateMetaDescription($request->input('content'));

        return response()->json(['meta_description' => $content]);
    }

    public function excerpt(Request $request, AiTranslationService $translation): JsonResponse
    {
        $this->authorize('accessAdmin');

        $request->validate([
            'content' => ['required', 'string', 'max:50000'],
        ]);

        $content = $translation->generateExcerpt($request->input('content'));

        return response()->json(['excerpt' => $content]);
    }

    public function headings(Request $request, AiContentService $service): JsonResponse
    {
        $this->authorize('accessAdmin');

        $request->validate([
            'title_or_keyword' => ['required', 'string', 'max:500'],
            'count' => ['sometimes', 'integer', 'min:2', 'max:15'],
        ]);

        $headings = $service->generateHeadings(
            $request->input('title_or_keyword'),
            (int) $request->input('count', 6)
        );

        return response()->json(['headings' => $headings]);
    }

    public function paragraph(Request $request, AiContentService $service): JsonResponse
    {
        $this->authorize('accessAdmin');

        $request->validate([
            'heading_or_context' => ['required', 'string', 'max:2000'],
            'tone' => ['nullable', 'string', 'max:200'],
        ]);

        $content = $service->generateParagraph(
            $request->input('heading_or_context'),
            $request->input('tone')
        );

        return response()->json(['content' => $content]);
    }

    public function blogDraft(Request $request, AiContentService $service): JsonResponse
    {
        $this->authorize('accessAdmin');

        $request->validate([
            'title' => ['required', 'string', 'max:500'],
            'bullet_points' => ['required', 'array'],
            'bullet_points.*' => ['string', 'max:1000'],
            'locale' => ['nullable', 'string', 'max:20'],
        ]);

        $content = $service->generateBlogDraft(
            $request->input('title'),
            $request->input('bullet_points', []),
            $request->input('locale')
        );

        return response()->json(['content' => $content]);
    }

    public function rewrite(Request $request, AiContentService $service): JsonResponse
    {
        $this->authorize('accessAdmin');

        $request->validate([
            'text' => ['required', 'string', 'max:50000'],
            'instruction' => ['required', 'string', 'max:500'],
        ]);

        $content = $service->rewrite(
            $request->input('text'),
            $request->input('instruction')
        );

        return response()->json(['content' => $content]);
    }
}
