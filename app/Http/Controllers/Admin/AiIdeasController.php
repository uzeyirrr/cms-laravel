<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Services\AiIdeaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiIdeasController extends Controller
{
    public function index(): Response
    {
        $this->authorize('accessAdmin');

        return Inertia::render('admin/ai/ideas/index', [
            'languages' => Language::where('is_active', true)->get(['id', 'code', 'name']),
        ]);
    }

    public function suggest(Request $request, AiIdeaService $service): JsonResponse
    {
        $this->authorize('accessAdmin');

        $request->validate([
            'category_or_keyword' => ['required', 'string', 'max:500'],
            'locale' => ['required', 'string', 'max:20'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:20'],
        ]);

        $limit = (int) $request->input('limit', 10);
        $topics = $service->suggestTopics(
            $request->input('category_or_keyword'),
            $request->input('locale'),
            $limit
        );

        return response()->json(['topics' => $topics]);
    }
}
