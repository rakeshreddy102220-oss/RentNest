import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const labels = {
  owner: 'Owner Login',
  tenant: 'Tenant Login',
  admin: 'Admin Login'
};

interface LoginPageProps {
  role: 'owner' | 'tenant' | 'admin';
}

export default function LoginPage({ role }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      localStorage.setItem('rentnest_token', result.token);
      setUser(result.user);
      navigate(`/${result.user.role}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[36px] border border-slate-200/80 bg-white/90 p-10 shadow-glass">
      <div className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Secure access</p>
        <h1 className="text-4xl font-semibold text-slate-900">{labels[role]}</h1>
        <p className="max-w-2xl text-slate-600">Enter your credentials to continue into the RentNest {role} portal.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error ? <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Continue'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        New to RentNest?{' '}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
