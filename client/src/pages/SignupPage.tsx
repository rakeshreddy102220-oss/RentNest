import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const roles = [
  { value: 'owner', label: 'Property Owner' },
  { value: 'tenant', label: 'Tenant' }
];

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signup(name, email, password, role, role === 'owner' ? phoneNumber : undefined);
      localStorage.setItem('rentnest_token', result.token);
      setUser(result.user);
      navigate(`/${result.user.role}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[36px] border border-slate-200/80 bg-white/90 p-10 shadow-glass">
      <div className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Create your account</p>
        <h1 className="text-4xl font-semibold text-slate-900">Sign up for RentNest</h1>
        <p className="max-w-2xl text-slate-600">Choose your role and begin your premium rental journey.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error ? <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Email address
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
        {role === 'owner' ? (
          <label className="space-y-2 text-sm text-slate-700">
            Phone number
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              type="tel"
              maxLength={10}
              required
              placeholder="10 digit phone number"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        ) : null}
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
        <label className="space-y-2 text-sm text-slate-700">
          Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {roles.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
