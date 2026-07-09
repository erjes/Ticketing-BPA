<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = TicketCategory::latest()->get();
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:ticket_categories,name',
        ]);

        TicketCategory::create([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, TicketCategory $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:ticket_categories,name,' . $category->id,
        ]);

        $category->update([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(TicketCategory $category)
    {
        // Prevent deleting if it is the only category (maybe just a soft check, but skip for MVP)
        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
