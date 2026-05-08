import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  let userRole = null;
  let userName = 'User';

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userRole = user?.role;
    userName = user?.name || 'User';
  } catch {
    // Ignore error
  }

  const isAdmin = userRole === 'admin';

  // Route protection
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Using window.location to force a full refresh back to login
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex text-zinc-300 font-sans selection:bg-zinc-200 selection:text-black">

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-zinc-800 bg-[#09090b] flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          {/* Logo copied from Login page */}
          <div className="flex items-baseline gap-1 select-none">
            <span className="text-xl font-bold tracking-tight text-white">Team</span>
            <span className="text-xl font-light tracking-tight text-zinc-500">Reviewer</span>

          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/dashboard"
            className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === '/dashboard'
              ? 'text-white bg-zinc-800/50'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
              }`}
          >
            Dashboard
          </Link>
          {isAdmin && (
            <Link
              to="/employees"
              className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === '/employees'
                ? 'text-white bg-zinc-800/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                }`}
            >
              Employees
            </Link>
          )}
          <Link
            to="/reviews"
            className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === '/reviews'
              ? 'text-white bg-zinc-800/50'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
              }`}
          >
            {isAdmin ? 'All Reviews' : 'My Reviews'}
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/30 rounded-md transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">

        <header className="h-16 border-b border-zinc-800 flex items-center px-8 bg-[#09090b]/80 backdrop-blur-md relative z-10">
          {/* You can add breadcrumbs, a search bar, or user profile icon here later */}
          <div className="flex-1"></div>
          <div className="text-sm text-zinc-400">
            {userName}
          </div>
        </header>

        {/* Scrollable page content */}
        <div className="flex-1 overflow-auto p-8 relative z-10">
          {/* <Outlet /> is where child routes like <Dashboard /> will be injected */}
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default MainLayout;
