<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePromptTemplateRequest;
use App\Http\Requests\Admin\UpdatePromptTemplateRequest;
use App\Models\PromptTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromptTemplateController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('accessAdmin');

        $templates = PromptTemplate::query()
            ->when($request->input('search'), fn ($q) => $q->where('name', 'like', '%'.$request->input('search').'%')
                ->orWhere('category', 'like', '%'.$request->input('search').'%'))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/ai/templates/index', [
            'templates' => $templates,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('accessAdmin');

        return Inertia::render('admin/ai/templates/create');
    }

    public function store(StorePromptTemplateRequest $request): RedirectResponse
    {
        PromptTemplate::create($request->validated());

        return redirect()->route('admin.ai.templates.index')->with('status', __('Prompt sablonu olusturuldu.'));
    }

    public function edit(PromptTemplate $prompt_template): Response
    {
        $this->authorize('accessAdmin');

        return Inertia::render('admin/ai/templates/edit', [
            'template' => $prompt_template,
        ]);
    }

    public function update(UpdatePromptTemplateRequest $request, PromptTemplate $prompt_template): RedirectResponse
    {
        $prompt_template->update($request->validated());

        return redirect()->back()->with('status', __('Prompt sablonu guncellendi.'));
    }

    public function destroy(PromptTemplate $prompt_template): RedirectResponse
    {
        $this->authorize('accessAdmin');

        $prompt_template->delete();

        return redirect()->route('admin.ai.templates.index')->with('status', __('Prompt sablonu silindi.'));
    }
}
