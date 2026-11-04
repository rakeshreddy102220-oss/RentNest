import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOwnerProperties, getOwnerSummary } from '../utils/api';
import type { Property } from '../types';

const defaultStats = [
  { title: 'Total Properties', value: '0' },
  { title: 'Active Listings', value: '0' },
  { title: 'Pending Review', value: '0' },
  { title: 'Interested Users', value: '0' }
];

export default function OwnerDashboard() {
  const [summary, setSummary] = useState<{ totalListings: number; activeListings: number; pendingListings: number; interestedTenants: number } | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOwnerSummary(), getOwnerProperties()])
      .then(([summaryResult, propertiesResult]) => {
        setSummary(summaryResult);
        setProperties(propertiesResult);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = summary
    ? [
        { title: 'Total Properties', value: String(summary.totalListings) },
        { title: 'Active Listings', value: String(summary.activeListings) },
        { title: 'Pending Review', value: String(summary.pendingListings) },
        { title: 'Interested Users', value: String(summary.interestedTenants) }
      ]
    : defaultStats;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass lg:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Owner Dashboard</p>
          <h1 className="text-4xl font-semibold text-slate-900">Manage your properties with one premium workspace.</h1>
          <p className="text-slate-600">Upload new listings, see interested tenants, and keep your portfolio polished.</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/owner/add-property"
              className="inline-flex rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-95"
            >
              Add Property
            </Link>
            <Link
              to="/owner/properties"
              className="inline-flex rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-primary hover:text-primary"
            >
              My Properties
            </Link>
            <Link
              to="/owner/profile"
              className="inline-flex rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-primary hover:text-primary"
            >
              Edit Profile
            </Link>
            <Link
              to="/owner/interested"
              className="inline-flex rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-primary hover:text-primary"
            >
              Interested Tenants
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((item) => (
            <div key={item.title} className="rounded-[28px] bg-slate-950/95 p-6 text-white shadow-xl shadow-slate-900/20">
              <p className="text-3xl font-semibold">{item.value}</p>
              <p className="mt-2 text-sm text-slate-300">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6 rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-primary">Recent Listings</p>
              <h2 className="text-2xl font-semibold text-slate-900">Your live portfolio</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800">Active</span>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-slate-200 p-5 shadow-sm text-slate-500">Loading your listings…</div>
            ) : properties.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 p-5 shadow-sm text-slate-500">No listings available yet. Add a property to start receiving interest.</div>
            ) : (
              properties.slice(0, 3).map((property) => (
                <div key={property.id} className="rounded-3xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{property.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{property.bhk} • ₹{property.rent} / mo • {property.city}</p>
                    </div>
                    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-primary hover:text-primary">
                      Manage
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Notifications</p>
          <h2 className="text-2xl font-semibold text-slate-900">Recent activity</h2>
          <div className="mt-6 space-y-4">
            {[
              'Someone is interested in your property Moonlight Suites.',
              'Your listing Urban Loft has been viewed 120 times today.',
              'Property Silver Oaks Villa has a new request for a site visit.'
            ].map((notification) => (
              <div key={notification} className="rounded-3xl bg-slate-50 p-4 text-slate-700">
                {notification}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
