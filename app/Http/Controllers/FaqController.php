<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $query = Faq::where('is_published', true)->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('question', 'like', "%{$search}%")
                  ->orWhere('answer', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Faqs/Index', [
            'faqs' => $query->get(),
            'filters' => [
                'search' => $search ?? '',
            ]
        ]);
    }
}
