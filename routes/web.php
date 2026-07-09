<?php

use App\Http\Controllers\Auth\OnboardingController;
use App\Http\Controllers\SuperAdmin\UserController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Onboarding
    Route::get('onboarding', [OnboardingController::class, 'show'])->name('onboarding');
    Route::post('onboarding', [OnboardingController::class, 'store'])->name('onboarding.store');

    // User Routes
    Route::middleware(['role:user', 'profile.complete'])->group(function () {
        Route::get('dashboard', [TicketController::class, 'index'])->name('dashboard');
        Route::get('tickets', [\App\Http\Controllers\TicketController::class, 'tickets'])->name('tickets.index');
        Route::get('tickets/search-suggestions', [TicketController::class, 'searchSuggestions'])->name('tickets.search-suggestions');
        Route::get('tickets/create', [TicketController::class, 'create'])->name('tickets.create');
        Route::post('tickets', [TicketController::class, 'store'])->name('tickets.store');
        Route::get('tickets/{ticket:ticket_number}', [TicketController::class, 'show'])->name('tickets.show');
        Route::post('tickets/{ticket:ticket_number}/reply', [TicketController::class, 'reply'])->name('tickets.reply');
    });

    // Admin Routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [App\Http\Controllers\Admin\TicketController::class, 'index'])->name('dashboard');
        Route::get('tickets', [\App\Http\Controllers\Admin\TicketController::class, 'tickets'])->name('tickets.index');
        Route::get('tickets/search-suggestions', [App\Http\Controllers\Admin\TicketController::class, 'searchSuggestions'])->name('tickets.search-suggestions');
        Route::get('tickets/category', [TicketController::class, 'categoryIndex'])->name('tickets.category');
        Route::get('tickets/{ticket:ticket_number}', [App\Http\Controllers\Admin\TicketController::class, 'show'])->name('tickets.show');
        Route::put('tickets/{ticket:ticket_number}', [\App\Http\Controllers\Admin\TicketController::class, 'update'])->name('tickets.update');
        Route::delete('tickets/{ticket:ticket_number}', [\App\Http\Controllers\Admin\TicketController::class, 'destroy'])->name('tickets.destroy');
        Route::post('tickets/{ticket:ticket_number}/status', [App\Http\Controllers\Admin\TicketController::class, 'updateStatus'])->name('tickets.status');
        Route::post('tickets/{ticket:ticket_number}/reply', [App\Http\Controllers\Admin\TicketController::class, 'reply'])->name('tickets.reply');
        
        Route::get('activity-logs', [\App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('activity-logs.index');
        
        Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class)->except(['create', 'show', 'edit']);
    });

    // Super Admin Routes
    Route::middleware(['role:super_admin'])->prefix('super-admin')->name('superadmin.')->group(function () {
        Route::get('dashboard', [UserController::class, 'index'])->name('dashboard');
        Route::post('users/{user}/role', [UserController::class, 'updateRole'])->name('users.role');
        Route::delete('users/{user}', [\App\Http\Controllers\SuperAdmin\UserController::class, 'destroy'])->name('users.destroy');
        
        Route::get('activity-logs', [\App\Http\Controllers\SuperAdmin\ActivityLogController::class, 'index'])->name('activity-logs.index');
    });

});

require __DIR__.'/settings.php';
