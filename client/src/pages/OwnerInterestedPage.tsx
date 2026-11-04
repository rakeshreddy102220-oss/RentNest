import { useEffect, useState } from 'react';
import { getOwnerInterests } from '../utils/api';

interface OwnerInterest {
  id: number;
  interestDate: string;
  tenantName: string;
  tenantEmail: string;
  propertyId: number;
  propertyTitle: string;
}

export default function OwnerInterestedPage() {
  const [interests, setInterests] = useState<OwnerInterest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnerInterests()
      .then(setInterests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Interested Tenants</p>
        <h1 className="text-4xl font-semibold text-slate-900">See who wants your properties</h1>
        <p className="text-slate-600">Review tenant interest requests and follow up with a direct call or WhatsApp message.</p>
      </div>

      {loading ? (
        <div className="rounded-[32px] border border-slate-200/70 bg-slate-50 p-10 text-center text-slate-500 shadow-sm">Loading tenant interest…</div>
      ) : interests.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
          <p className="text-lg font-semibold text-slate-900">No interest requests yet</p>
          <p className="mt-2">Your active listings will show tenant inquiries here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {interests.map((interest) => (
            <div key={interest.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-primary">{interest.propertyTitle}</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">{interest.tenantName}</h2>
                  <p className="mt-1 text-sm text-slate-500">{interest.tenantEmail}</p>
                </div>
                <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{new Date(interest.interestDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
