import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loadProperties } from '../utils/api';
import type { Property } from '../types';

export default function TenantDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');

  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set('status', 'approved');
    if (city.trim()) params.set('city', city.trim());
    if (minRent.trim()) params.set('minRent', minRent.trim());
    if (maxRent.trim()) params.set('maxRent', maxRent.trim());
    return params.toString() ? `?${params.toString()}` : '';
  };

  const refreshProperties = async (query = '') => {
    setLoading(true);
    try {
      const result = await loadProperties(query);
      setProperties(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProperties(buildQuery());
  }, []);

  const handleSearch = () => refreshProperties(buildQuery());
  const handleReset = () => {
    setCity('');
    setMinRent('');
    setMaxRent('');
    refreshProperties('?status=approved');
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-primary">Tenant Portal</p>
            <h1 className="text-4xl font-semibold text-slate-900">Search premium listings with powerful filters.</h1>
          </div>
          <div className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            Trending: Spacious 3BHK apartments
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="rounded-[36px] border border-slate-200/70 bg-white/90 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Top Search</p>
          <div className="mt-6 space-y-4">
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Search city or area"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={minRent}
              onChange={(event) => setMinRent(event.target.value)}
              placeholder="Minimum Rent"
              type="number"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={maxRent}
              onChange={(event) => setMaxRent(event.target.value)}
              placeholder="Maximum Rent"
              type="number"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleSearch}
                className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                Reset
              </button>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[28px] bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-5 text-white shadow-xl shadow-slate-900/20">
            <p className="uppercase tracking-[0.32em] text-sm text-slate-300">Featured search</p>
            <h2 className="mt-3 text-2xl font-semibold">Filtered results for your ideal rental match</h2>
          </div>
          {loading ? (
            <div className="rounded-[32px] border border-slate-200/70 bg-slate-50 p-10 text-center text-slate-500 shadow-sm">Loading properties…</div>
          ) : properties.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
              <p className="text-lg font-semibold text-slate-900">No matching rentals found</p>
              <p className="mt-2">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {properties.slice(0, 4).map((property) => (
                <article key={property.id} className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                    <img src={property.images[0]} alt={property.title} className="h-72 w-full object-cover" />
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.28em] text-primary">{property.city}</p>
                        <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800">Verified</span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-slate-900">{property.title}</h3>
                      <p className="mt-3 text-slate-600">{property.description.slice(0, 100)}…</p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{property.bhk}</div>
                        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Available {property.availability}</div>
                      </div>
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link to={`/properties/${property.id}`} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95">
                          View Details
                        </Link>
                        <button className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">
                          Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
