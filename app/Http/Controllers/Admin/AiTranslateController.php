<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\TranslateContentJob;
use App\Models\Language;
use App\Models\Page;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiTranslateController extends Controller
{
    public function index(): Response
    {
        $this->authorize('accessAdmin');

        return Inertia::render('admin/ai-translate/index', [
            'pages' => Page::with('language')->latest()->limit(50)->get(),
            'posts' => Post::with('language')->latest()->limit(50)->get(),
            'languages' => Language::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('accessAdmin');

        $request->validate([
            'model_type' => ['required', 'in:page,post'],
            'model_id' => ['required', 'integer'],
            'target_language_id' => ['required', 'exists:languages,id'],
        ]);

        $modelType = $request->input('model_type') === 'page' ? Page::class : Post::class;
        TranslateContentJob::dispatch(
            $modelType,
            (int) $request->input('model_id'),
            (int) $request->input('target_language_id')
        );

        return redirect()->back()->with('status', __('Translation job queued.'));
    }
}
