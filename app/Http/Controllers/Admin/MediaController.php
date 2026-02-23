<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Media::class);

        $media = Media::query()
            ->with('user')
            ->when($request->input('search'), fn ($q) => $q->where('name', 'like', '%'.$request->input('search').'%'))
            ->latest()
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('admin/media/index', [
            'media' => $media,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Media::class);

        $request->validate([
            'file' => ['required', 'file', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->store('media', 'public');

        Media::create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'disk' => 'public',
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->back()->with('status', __('File uploaded.'));
    }

    public function destroy(Media $medium): RedirectResponse
    {
        $this->authorize('delete', $medium);

        Storage::disk($medium->disk)->delete($medium->path);
        $medium->translations()->delete();
        $medium->delete();

        return redirect()->back()->with('status', __('File deleted.'));
    }
}
