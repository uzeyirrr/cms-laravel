<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Redirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RedirectController extends Controller
{
    public function index(): Response
    {
        $redirects = Redirect::query()->latest()->paginate(15);

        return Inertia::render('admin/redirects/index', [
            'redirects' => $redirects,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/redirects/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'from_path' => ['required', 'string', 'max:500'],
            'to_path' => ['required', 'string', 'max:500'],
            'status_code' => ['required', 'in:301,302'],
            'is_active' => ['boolean'],
        ]);

        Redirect::create([
            'from_path' => $request->input('from_path'),
            'to_path' => $request->input('to_path'),
            'status_code' => (int) $request->input('status_code'),
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.redirects.index')->with('status', __('Redirect created.'));
    }

    public function edit(Redirect $redirect): Response
    {
        return Inertia::render('admin/redirects/edit', [
            'redirect' => $redirect,
        ]);
    }

    public function update(Request $request, Redirect $redirect): RedirectResponse
    {
        $request->validate([
            'from_path' => ['required', 'string', 'max:500'],
            'to_path' => ['required', 'string', 'max:500'],
            'status_code' => ['required', 'in:301,302'],
            'is_active' => ['boolean'],
        ]);

        $redirect->update([
            'from_path' => $request->input('from_path'),
            'to_path' => $request->input('to_path'),
            'status_code' => (int) $request->input('status_code'),
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->back()->with('status', __('Redirect updated.'));
    }

    public function destroy(Redirect $redirect): RedirectResponse
    {
        $redirect->delete();

        return redirect()->route('admin.redirects.index')->with('status', __('Redirect deleted.'));
    }
}
