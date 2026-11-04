
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

    if (role === 'owner' && !/^[0-9]{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signup(
        name,
        email,
        password,
        role,
        role === 'owner' ? phoneNumber : undefined
      );

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
        <p className="text-sm uppercase tracking-[0.32em] text-primary">
          Create your account
        </p>

        <h1 className="text-4xl font-semibold text-slate-900">
          Sign up for RentNest
        </h1>

        <p className="max-w-2xl text-slate-600">
          Choose your role and begin your premium rental journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {error ? (
          <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {/* Full Name and Email */}
        <div className="grid gap-4 sm:grid-cols-2">

          <label className="space-y-2 text-sm text-slate-700">
            Full name

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder="Enter your full name"
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
              placeholder="Enter your email"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

        </div>

        {/* Phone Number - Only for Owners */}
        {role === 'owner' ? (
          <label className="space-y-2 text-sm text-slate-700 block">
            Phone number

            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(
                  e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                )
              }
              maxLength={10}
              minLength={10}
              pattern="[0-9]{10}"
              required
              placeholder="10 digit phone number"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

           
          </label>
        ) : null}

        {/* Password */}
        <label className="space-y-2 text-sm text-slate-700 block">
          Password

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Enter your password"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        {/* Role Selection */}
        <label className="space-y-2 text-sm text-slate-700 block">
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

        {/* Create Account Button */}
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

