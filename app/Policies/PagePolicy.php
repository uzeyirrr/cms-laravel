<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PagePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'editor'])->exists();
    }

    public function view(User $user, Page $page): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'editor'])->exists();
    }

    public function create(User $user): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'editor'])->exists();
    }

    public function update(User $user, Page $page): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'editor'])->exists();
    }

    public function delete(User $user, Page $page): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'editor'])->exists();
    }

    public function restore(User $user, Page $page): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'editor'])->exists();
    }

    public function forceDelete(User $user, Page $page): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'editor'])->exists();
    }
}
