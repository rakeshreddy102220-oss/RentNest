import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadProperties } from '../utils/api';
import type { Property } from '../types';

const filters = ['City', 'Budget', 'Property Type', 'BHK', 'Amenities'];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [type, setType] = useState('');
  const [bhk, setBhk] = useState('');
  const [amenities, setAmenities] = useState('');

  const buildQuery = () => {
    const params = new URLSearchParams();
    params.set('status', 'approved');
    if (city.trim()) params.set('city', city.trim());
    if (minRent.trim()) params.set('minRent', minRent.trim());
    if (maxRent.trim()) params.set('maxRent', maxRent.trim());
    if (type.trim()) params.set('type', type.trim());
    if (bhk.trim()) params.set('bhk', bhk.trim());
    if (amenities.trim()) params.set('amenities', amenities.trim());
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
    setType('');
    setBhk('');
    setAmenities('');
    refreshProperties('?status=approved');
  };

  return (
    <div className="space-y-10">
      <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-primary">Property Search</p>
            <h1 className="text-4xl font-semibold text-slate-900">Find your next home</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button key={filter} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-primary hover:text-primary">
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="rounded-[36px] border border-slate-200/70 bg-white/90 p-6 shadow-glass">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Filters</p>
          <div className="mt-6 space-y-4">
            <label className="space-y-2 text-sm text-slate-700">
              City
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="City"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Min Budget
              <input
                value={minRent}
                onChange={(event) => setMinRent(event.target.value)}
                type="number"
                placeholder="Minimum rent"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Max Budget
              <input
                value={maxRent}
                onChange={(event) => setMaxRent(event.target.value)}
                type="number"
                placeholder="Maximum rent"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Property Type
              <input
                value={type}
                onChange={(event) => setType(event.target.value)}
                placeholder="Apartment, Studio, Villa"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              BHK
              <input
                value={bhk}
                onChange={(event) => setBhk(event.target.value)}
                placeholder="1RK, 1BHK, 2BHK"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Amenities
              <input
                value={amenities}
                onChange={(event) => setAmenities(event.target.value)}
                placeholder="Pool, Gym, Parking"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-95"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            Reset
          </button>
        </aside>

        <section className="space-y-6">
          {loading ? (
            <div className="rounded-[32px] border border-slate-200/70 bg-slate-50 p-10 text-center text-slate-500 shadow-sm">Loading properties…</div>
          ) : properties.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
              <p className="text-lg font-semibold text-slate-900">No properties found</p>
              <p className="mt-2">Try adjusting your filters or explore the marketplace.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {properties.map((property) => (
                <article key={property.id} className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                    <img src={property.images[0]} alt={property.title} className="h-72 w-full object-cover" />
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-primary">{property.city}</p>
                          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{property.title}</h3>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800">Verified</span>
                      </div>
                      <p className="mt-4 text-slate-600">{property.description.slice(0, 120)}…</p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                          <span className="font-semibold text-slate-900">₹{property.rent}</span> / month
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{property.bhk}</div>
                      </div>
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link to={`/properties/${property.id}`} className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95">
                          View Details
                        </Link>
                        <button className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">
                          Save Property
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
