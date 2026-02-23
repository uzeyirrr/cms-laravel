<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePostRequest;
use App\Http\Requests\Admin\UpdatePostRequest;
use App\Models\ContentRevision;
use App\Models\Category;
use App\Models\Language;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Post::class);

        $posts = Post::query()
            ->with(['language', 'category', 'user'])
            ->when($request->input('search'), fn ($q) => $q->where('title', 'like', '%'.$request->input('search').'%'))
            ->when($request->input('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->when($request->input('language_id'), fn ($q) => $q->where('language_id', $request->input('language_id')))
            ->when($request->input('category_id'), fn ($q) => $q->where('category_id', $request->input('category_id')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'languages' => Language::where('is_active', true)->get(),
            'categories' => Category::with('language')->get(),
            'filters' => $request->only(['search', 'status', 'language_id', 'category_id']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Post::class);

        return Inertia::render('admin/posts/create', [
            'languages' => Language::where('is_active', true)->get(),
            'categories' => Category::with('language')->get(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $post = Post::create([...$request->safe()->except('related_post_ids'), 'user_id' => $request->user()->id]);

        $relatedIds = $request->input('related_post_ids', []);
        if (! empty($relatedIds)) {
            $post->relatedPosts()->sync($relatedIds);
        }

        return redirect()->route('admin.posts.edit', $post)->with('status', __('Post created.'));
    }

    public function edit(Post $post): Response
    {
        $this->authorize('update', $post);

        $post->load(['language', 'category', 'relatedPosts', 'revisions' => fn ($q) => $q->with('user')->limit(20)]);

        return Inertia::render('admin/posts/edit', [
            'post' => $post,
            'languages' => Language::where('is_active', true)->get(),
            'categories' => Category::with('language')->get(),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $post->update($request->safe()->except('related_post_ids'));

        $post->relatedPosts()->sync($request->input('related_post_ids', []));

        $post->revisions()->create([
            'snapshot' => $post->getAttributes(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->back()->with('status', __('Post updated.'));
    }

    public function restoreRevision(Post $post, ContentRevision $revision): RedirectResponse
    {
        $this->authorize('update', $post);

        if ($revision->subject_type !== Post::class || (int) $revision->subject_id !== (int) $post->id) {
            abort(404);
        }

        $snapshot = $revision->snapshot;
        $post->update(array_intersect_key($snapshot, array_flip($post->getFillable())));

        return redirect()->back()->with('status', __('Revision restored.'));
    }

    public function destroy(Post $post): RedirectResponse
    {
        $this->authorize('delete', $post);

        $post->relatedPosts()->detach();
        $post->delete();

        return redirect()->route('admin.posts.index')->with('status', __('Post deleted.'));
    }
}
