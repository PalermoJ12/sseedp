<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $page = $request->get('page', 1);
        
        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%")
                    ->orWhere('region', 'like', "%{$search}%")
                    ->orWhere('division', 'like', "%{$search}%")
                    ->orWhere('school_name', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($user) {
                return $user;
            });

        return Inertia::render('users', [
            'users' => $users,
            'filters' => ['search' => $search],
            'flash' => session('flash', [])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'school_id' => 'nullable|string',
            'region' => 'nullable|string',
            'division' => 'nullable|string',
            'school_name' => 'nullable|string',
            'role' => 'required|in:0,1',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        // Get current page from request, but ensure we stay on valid page
        $currentPage = $request->get('page', 1);
        $queryParams = [];
        
        if ($request->has('search') && !empty($request->get('search'))) {
            $queryParams['search'] = $request->get('search');
        }
        
        $queryParams['page'] = $currentPage;

        return redirect()->route('users.index', $queryParams)
            ->with('flash.success', 'User created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'school_id' => 'nullable',
            'region' => 'nullable|string',
            'division' => 'nullable|string',
            'school_name' => 'nullable|string',
            'role' => 'required|in:0,1',
        ]);

        // Only update password if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Preserve current page and search parameters
        $currentPage = $request->get('page', 1);
        $queryParams = [];
        
        if ($request->has('search') && !empty($request->get('search'))) {
            $queryParams['search'] = $request->get('search');
        }
        
        $queryParams['page'] = $currentPage;

        return redirect()->route('users.index', $queryParams)
            ->with('flash.success', 'User updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user)
    {
        $user->delete();

        // After deletion, we need to check if current page is still valid
        $currentPage = $request->get('page', 1);
        $search = $request->get('search');
        
        // Count remaining users to determine if we need to adjust page
        $remainingUsersQuery = User::query();
        if ($search) {
            $remainingUsersQuery->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('role', 'like', "%{$search}%")
                ->orWhere('region', 'like', "%{$search}%")
                ->orWhere('division', 'like', "%{$search}%")
                ->orWhere('school_name', 'like', "%{$search}%");
        }
        
        $totalUsers = $remainingUsersQuery->count();
        $perPage = 10;
        $maxPage = ceil($totalUsers / $perPage);
        
        // If current page is higher than max page, go to max page
        if ($currentPage > $maxPage && $maxPage > 0) {
            $currentPage = $maxPage;
        } elseif ($maxPage == 0) {
            $currentPage = 1;
        }

        $queryParams = [];
        if ($search) {
            $queryParams['search'] = $search;
        }
        if ($currentPage > 1) {
            $queryParams['page'] = $currentPage;
        }

        return redirect()->route('users.index', $queryParams)
            ->with('flash.success', 'User deleted successfully!');
    }

    /**
     * Get schools for dropdown
     */
    public function getSchools(Request $request)
    {
        $schools = School::select('school_id', 'school_name', 'region', 'division')
            ->orderBy('school_name')
            ->get();

        return response()->json($schools);
    }
}