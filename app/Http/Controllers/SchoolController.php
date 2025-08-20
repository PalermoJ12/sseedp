<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = School::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('school_name', 'like', "%{$search}%")
                ->orWhere('school_id', 'like', "%{$search}%")
                ->orWhere('region', 'like', "%{$search}%")
                ->orWhere('division', 'like', "%{$search}%");
        }

        return Inertia::render('schools', [
            'schools' => $query->paginate(8)->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'region' => 'required|string|max:100',
            'division' => 'required|string|max:100',
            'school_id' => 'required|string|max:20|unique:schools,school_id',
            'school_name' => 'required|string|max:255',
        ]);

        School::create($validated);

        return redirect()->back()->with('success', 'School created successfully!');
    }

    public function update(Request $request, School $school)
    {
        $validated = $request->validate([
            'region' => 'required|string|max:100',
            'division' => 'required|string|max:100',
            'school_id' => 'required|string|max:20|unique:schools,school_id,' . $school->id,
            'school_name' => 'required|string|max:255',
        ]);

        $school->update($validated);

        return redirect()->back()->with('success', 'School updated successfully!');
    }

    public function destroy(School $school)
    {
        $school->delete();

        return redirect()->back()->with('success', 'School deleted successfully!');
    }
}
