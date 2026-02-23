<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiBrandController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Setting::class);

        return Inertia::render('admin/ai/brand/index', [
            'ai_master_prompt' => Setting::getValue('ai_master_prompt', ''),
            'ai_tone' => Setting::getValue('ai_tone', ''),
            'ai_forbidden_words' => Setting::getValue('ai_forbidden_words', ''),
            'ai_preferred_words' => Setting::getValue('ai_preferred_words', ''),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $this->authorize('create', Setting::class);

        $request->validate([
            'ai_master_prompt' => ['nullable', 'string', 'max:10000'],
            'ai_tone' => ['nullable', 'string', 'max:500'],
            'ai_forbidden_words' => ['nullable', 'string', 'max:2000'],
            'ai_preferred_words' => ['nullable', 'string', 'max:2000'],
        ]);

        Setting::setValue('ai_master_prompt', $request->input('ai_master_prompt', ''));
        Setting::setValue('ai_tone', $request->input('ai_tone', ''));
        Setting::setValue('ai_forbidden_words', $request->input('ai_forbidden_words', ''));
        Setting::setValue('ai_preferred_words', $request->input('ai_preferred_words', ''));

        return redirect()->back()->with('status', __('Marka rehberi kaydedildi.'));
    }
}
