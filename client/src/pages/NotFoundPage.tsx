import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-[36px] border border-slate-200/70 bg-white/90 p-16 text-center shadow-glass">
      <p className="text-sm uppercase tracking-[0.32em] text-primary">404 error</p>
      <h1 className="mt-4 text-5xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-600">It looks like the page you are looking for has moved or no longer exists.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-primary px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-95">
        Return home
      </Link>
    </div>
  );
}
