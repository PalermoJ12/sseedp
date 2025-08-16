<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
use App\Http\Controllers\SportItemController;
Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::get('inventory', function () {
        return Inertia::render('inventory');
    })->name('inventory');

    Route::get('schools', function () {
        return Inertia::render('schools');
    })->name('schools');


    //ITEMS CRUD
    Route::get('items', [SportItemController::class, 'index'])->name('items.index');
    Route::get('/items', [SportItemController::class, 'index'])->name('items.index');
    Route::post('/items', [SportItemController::class, 'store'])->name('items.store');
    Route::put('/items/{item}', [SportItemController::class, 'update'])->name('items.update');
    Route::delete('/items/{item}', [SportItemController::class, 'destroy'])->name('items.destroy');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
