<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        if (! in_array($request->user()->role, $roles)) {
            // Redirect to the correct dashboard instead of 403
            return redirect()->to($this->dashboardForRole($request->user()->role));
        }

        return $next($request);
    }

    private function dashboardForRole(?string $role): string
    {
        return match ($role) {
            'admin' => '/admin/dashboard',
            'super_admin' => '/super-admin/dashboard',
            default => '/dashboard',
        };
    }
}
