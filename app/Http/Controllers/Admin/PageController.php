<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePageRequest;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Models\ActivityLog;
use App\Models\ContentRevision;
use App\Models\Language;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Page::class);

        $pages = Page::query()
            ->with(['language', 'user'])
            ->when($request->input('search'), fn ($q) => $q->where('title', 'like', '%'.$request->input('search').'%'))
            ->when($request->input('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->when($request->input('language_id'), fn ($q) => $q->where('language_id', $request->input('language_id')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/pages/index', [
            'pages' => $pages,
            'languages' => Language::where('is_active', true)->get(),
            'filters' => $request->only(['search', 'status', 'language_id']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Page::class);

        return Inertia::render('admin/pages/create', [
            'languages' => Language::where('is_active', true)->get(),
        ]);
    }

    public function store(StorePageRequest $request): RedirectResponse
    {
        $page = Page::create([...$request->validated(), 'user_id' => $request->user()->id]);
        ActivityLog::log('created', $page, null, $page->getAttributes());

        return redirect()->route('admin.pages.edit', $page)->with('status', __('Page created.'));
    }

    public function edit(Page $page): Response
    {
        $this->authorize('update', $page);

        $page->load(['language', 'revisions' => fn ($q) => $q->with('user')->limit(20)]);

        return Inertia::render('admin/pages/edit', [
            'page' => $page,
            'languages' => Language::where('is_active', true)->get(),
        ]);
    }

    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        $old = $page->getAttributes();
        $page->update($request->validated());
        ActivityLog::log('updated', $page, $old, $page->getAttributes());

        $page->revisions()->create([
            'snapshot' => $page->getAttributes(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->back()->with('status', __('Page updated.'));
    }

    public function restoreRevision(Page $page, ContentRevision $revision): RedirectResponse
    {
        $this->authorize('update', $page);

        if ($revision->subject_type !== Page::class || (int) $revision->subject_id !== (int) $page->id) {
            abort(404);
        }

        $snapshot = $revision->snapshot;
        $page->update(array_intersect_key($snapshot, array_flip($page->getFillable())));

        return redirect()->back()->with('status', __('Revision restored.'));
    }

    public function destroy(Page $page): RedirectResponse
    {
        $this->authorize('delete', $page);

        $old = $page->getAttributes();
        $page->delete();
        ActivityLog::log('deleted', $page, $old, null);

        return redirect()->route('admin.pages.index')->with('status', __('Page deleted.'));
    }
}
