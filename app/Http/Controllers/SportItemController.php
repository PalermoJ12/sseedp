<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SportItem;
use App\Models\Sport;
use Inertia\Inertia;

class SportItemController extends Controller
{
    public function index(Request $request)
    {
        $sports = Sport::all();

        $query = SportItem::with('sport');

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                    ->orWhereHas('sport', function ($q2) use ($search) {
                        $q2->where('sport_name', 'like', "%{$search}%");
                    });
            });
        }

        $items = $query->paginate(8)->withQueryString();

        return Inertia::render('items', [
            'items' => $items,
            'sports' => $sports,
            'filters' => $request->only('search'),
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
