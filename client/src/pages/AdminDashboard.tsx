import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAdminPendingProperties, getAdminSummary } from '../utils/api';
import type { Property } from '../types';

const defaultStats = [
  { title: 'Total Users', value: '0' },
  { title: 'Total Owners', value: '0' },
  { title: 'Total Tenants', value: '0' },
  { title: 'Total Properties', value: '0' }
];

export default function AdminDashboard() {
  const [summary, setSummary] = useState<{ totalUsers: number; totalOwners: number; totalTenants: number; totalProperties: number; pendingReviews: number } | null>(null);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminSummary(), getAdminPendingProperties()])
      .then(([summaryResult, pendingResult]) => {
        setSummary(summaryResult);
        setPendingProperties(pendingResult);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = summary
    ? [
        { title: 'Total Users', value: String(summary.totalUsers) },
        { title: 'Total Owners', value: String(summary.totalOwners) },
        { title: 'Total Tenants', value: String(summary.totalTenants) },
        { title: 'Total Properties', value: String(summary.totalProperties) }
      ]
    : defaultStats;

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-primary">Admin Portal</p>
            <h1 className="text-4xl font-semibold text-slate-900">Monitor trust and ensure high-quality listings.</h1>
            <p className="text-slate-600">Approve new listings, review reports, and manage suspicious accounts.</p>
          </div>
          <div className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            Pending Reviews: {loading ? 'Loading…' : summary?.pendingReviews ?? 0}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.title} className="rounded-[28px] bg-gradient-to-br from-primary to-secondary px-6 py-7 text-white shadow-xl shadow-primary/20">
            <p className="text-3xl font-semibold">{item.value}</p>
            <p className="mt-2 text-sm text-slate-100/80">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Admin actions</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/admin/pending-listings"
            className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-95"
          >
            Review Pending Listings
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Recent Activities</p>
          <div className="mt-6 space-y-4">
            {[
              'Approved 5 new PG listings in Mumbai.',
              'Blocked a suspicious tenant account.',
              'Reviewed flagged property request from Pune.'
            ].map((activity) => (
              <div key={activity} className="rounded-3xl bg-slate-50 p-5 text-slate-700">{activity}</div>
            ))}
          </div>
        </div>
        <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
          <p className="text-sm uppercase tracking-[0.32em] text-primary">Pending Listings</p>
          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-slate-200 p-5 shadow-sm text-slate-500">Loading pending reviews…</div>
            ) : pendingProperties.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 p-5 shadow-sm text-slate-500">No pending listings to review right now.</div>
            ) : (
              pendingProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 p-5">
                  <div>
                    <p className="font-semibold text-slate-900">{property.title}</p>
                    <p className="text-sm text-slate-500">{property.city} • {property.area}</p>
                  </div>
                  <Link
                    to="/admin/pending-listings"
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-primary hover:text-primary"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
