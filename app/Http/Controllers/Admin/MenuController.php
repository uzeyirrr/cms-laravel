<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMenuRequest;
use App\Http\Requests\Admin\UpdateMenuRequest;
use App\Models\Language;
use App\Models\Menu;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Menu::class);

        $menus = Menu::query()
            ->with('language')
            ->when($request->input('language_id'), fn ($q) => $q->where('language_id', $request->input('language_id')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/menus/index', [
            'menus' => $menus,
            'languages' => Language::where('is_active', true)->get(),
            'filters' => $request->only(['language_id']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Menu::class);

        return Inertia::render('admin/menus/create', [
            'languages' => Language::where('is_active', true)->get(),
        ]);
    }

    public function store(StoreMenuRequest $request): RedirectResponse
    {
        Menu::create($request->validated());

        return redirect()->route('admin.menus.index')->with('status', __('Menu created.'));
    }

    public function edit(Menu $menu): Response
    {
        $this->authorize('update', $menu);

        $menu->load('language');

        return Inertia::render('admin/menus/edit', [
            'menu' => $menu,
            'languages' => Language::where('is_active', true)->get(),
        ]);
    }

    public function update(UpdateMenuRequest $request, Menu $menu): RedirectResponse
    {
        $menu->update($request->validated());

        return redirect()->back()->with('status', __('Menu updated.'));
    }

    public function destroy(Menu $menu): RedirectResponse
    {
        $this->authorize('delete', $menu);

        $menu->delete();

        return redirect()->route('admin.menus.index')->with('status', __('Menu deleted.'));
    }
}
