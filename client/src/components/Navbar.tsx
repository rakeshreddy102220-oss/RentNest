import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Owner', to: '/owner/login' },
  { label: 'Tenant', to: '/tenant/login' },
  { label: 'Admin', to: '/admin/login' }
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 font-semibold text-slate-900">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary text-white shadow-glass">R</span>
          <div>
            <p className="text-lg">RentNest</p>
            <p className="text-xs text-slate-500">Premium rental marketplace</p>
          </div>
        </Link>
        <nav className="hidden gap-6 md:flex">
          {user ? (
            <NavLink
              to={`/${user.role}/dashboard`}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-primary text-white shadow-xl' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              Dashboard
            </NavLink>
          ) : (
            navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-primary text-white shadow-xl' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={`/${user.role}/dashboard`}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800"
              >
                {user.name}
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/tenant/login"
              className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-95"
            >
              Start Exploring
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
