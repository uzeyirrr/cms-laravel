<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\RedirectController;
use App\Http\Controllers\Admin\AiTranslateController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\PageController as PublicPageController;
use App\Http\Controllers\Public\PostController as PublicPostController;
use App\Http\Controllers\Public\SearchController;
use App\Http\Controllers\Public\SitemapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/sayfa/{slug}', [PublicPageController::class, 'show'])->name('public.page');
Route::get('/blog', [PublicPostController::class, 'index'])->name('public.blog');
Route::get('/blog/{slug}', [PublicPostController::class, 'show'])->name('public.post');
Route::get('/ara', [SearchController::class, 'index'])->name('public.search');
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('public.sitemap');

Route::get('/welcome', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('welcome');

Route::middleware(['auth', 'verified', 'can:accessAdmin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('admin/pages', PageController::class)->except(['show'])->names('admin.pages')->parameters(['page' => 'page']);
    Route::post('admin/pages/{page}/revisions/{revision}/restore', [PageController::class, 'restoreRevision'])->name('admin.pages.revisions.restore');
    Route::resource('admin/categories', CategoryController::class)->except(['show'])->names('admin.categories')->parameters(['category' => 'category']);
    Route::resource('admin/posts', PostController::class)->except(['show'])->names('admin.posts')->parameters(['post' => 'post']);
    Route::post('admin/posts/{post}/revisions/{revision}/restore', [PostController::class, 'restoreRevision'])->name('admin.posts.revisions.restore');
    Route::get('admin/media', [MediaController::class, 'index'])->name('admin.media.index');
    Route::post('admin/media', [MediaController::class, 'store'])->name('admin.media.store');
    Route::delete('admin/media/{medium}', [MediaController::class, 'destroy'])->name('admin.media.destroy');
    Route::resource('admin/menus', MenuController::class)->except(['show'])->names('admin.menus')->parameters(['menu' => 'menu']);
    Route::get('admin/settings', [SettingController::class, 'index'])->name('admin.settings.index');
    Route::put('admin/settings', [SettingController::class, 'update'])->name('admin.settings.update');
    Route::get('admin/ai-translate', [AiTranslateController::class, 'index'])->name('admin.ai-translate.index');
    Route::post('admin/ai-translate', [AiTranslateController::class, 'store'])->name('admin.ai-translate.store');
    Route::resource('admin/redirects', RedirectController::class)->except(['show'])->names('admin.redirects')->parameters(['redirect' => 'redirect']);
});

require __DIR__.'/settings.php';
