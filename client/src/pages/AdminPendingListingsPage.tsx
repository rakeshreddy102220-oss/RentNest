import { useEffect, useState } from 'react';
import { approveProperty, getAdminPendingProperties, rejectProperty } from '../utils/api';
import type { Property } from '../types';

export default function AdminPendingListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const result = await getAdminPendingProperties();
      setProperties(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAction = async (id: number, approve: boolean) => {
    if (approve) {
      await approveProperty(id.toString());
    } else {
      await rejectProperty(id.toString());
    }
    refresh();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Admin review</p>
        <h1 className="text-4xl font-semibold text-slate-900">Pending property approvals</h1>
        <p className="text-slate-600">Review newly submitted properties, then approve or reject them for the marketplace.</p>
      </div>

      {loading ? (
        <div className="rounded-[32px] border border-slate-200/70 bg-slate-50 p-10 text-center text-slate-500 shadow-sm">Loading pending listings…</div>
      ) : properties.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
          <p className="text-lg font-semibold text-slate-900">No pending requests</p>
          <p className="mt-2">All new listings have been reviewed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {properties.map((property) => (
            <div key={property.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_0.75fr]">
                <div>
                  <p className="text-sm uppercase tracking-[0.26em] text-primary">{property.city} • {property.area}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{property.title}</h2>
                  <p className="mt-3 text-slate-600">{property.description.slice(0, 140)}…</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-700">
                    <span className="rounded-full bg-slate-100 px-3 py-2">{property.bhk}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-2">{property.type}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-2">₹{property.rent}</span>
                  </div>
                </div>
                <div className="grid gap-3">
                  <button
                    onClick={() => handleAction(property.id, true)}
                    className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/15 hover:opacity-95"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(property.id, false)}
                    className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
