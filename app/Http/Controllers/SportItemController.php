<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SportItem;
use App\Models\Sport;
use Inertia\Inertia;

class SportItemController extends Controller
{
    public function index()
    {
        $sports = Sport::all();
        $items = SportItem::with('sport')->paginate(8);

        return Inertia::render('items', [
            'items' => $items,
            'sports' => $sports,
        ]);
    }

    // Create new item
    public function store(Request $request)
    {
        $request->validate([
            'item_name' => 'required|string|max:255',
            'sport_id' => 'required|exists:sports,id',
        ]);

        $item = SportItem::create([
            'item_name' => $request->item_name,
            'sport_id' => $request->sport_id,
        ]);

        $page = $request->input('page', 1); // default to page 1
        return redirect()->route('items.index', ['page' => $page])
            ->with('success', 'Item created successfully!');
    }

    public function update(Request $request, SportItem $item)
    {
        $request->validate([
            'item_name' => 'required|string|max:255',
            'sport_id' => 'required|exists:sports,id',
        ]);

        $item->update([
            'item_name' => $request->item_name,
            'sport_id' => $request->sport_id,
        ]);

        $page = $request->input('page', 1);
        return redirect()->route('items.index', ['page' => $page])
            ->with('success', 'Item updated successfully!');
    }

    public function destroy(Request $request, SportItem $item)
    {
        $item->delete();

        $page = $request->input('page', 1);
        return redirect()->route('items.index', ['page' => $page])
            ->with('success', 'Item deleted successfully!');
    }

}
