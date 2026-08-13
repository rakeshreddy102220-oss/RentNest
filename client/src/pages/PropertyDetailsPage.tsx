import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { expressInterest, loadProperty } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import type { Property } from '../types';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    loadProperty(id)
      .then(setProperty)
      .catch(() => {
        setProperty(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleInterest = async () => {
    if (!id) return;
    try {
      await expressInterest(id);
      setMessage('Your interest has been sent successfully. The owner and admin have been notified.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to submit interest. Please login as a tenant.');
    }
  };

  if (loading) {
    return <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-12 shadow-glass text-center text-slate-500">Loading property details…</div>;
  }

  if (!property) {
    return <div className="rounded-[36px] border border-rose-200 bg-rose-50 p-12 text-center text-rose-700 shadow-glass">Property not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <img src={property.images[0]} alt={property.title} className="h-[420px] w-full rounded-[32px] object-cover" />
            <div className="grid gap-4 sm:grid-cols-3">
              {property.images.slice(1).map((src) => (
                <img key={src} src={src} alt={property.title} className="h-32 w-full rounded-3xl object-cover" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{property.city} • {property.area}</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">{property.title}</h1>
              <p className="mt-2 text-slate-600">{property.description}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">{property.bhk}</span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">{property.type}</span>
                <span className="rounded-full bg-white px-4 py-2 shadow-sm">Available from {property.availability}</span>
              </div>
            </div>
            <div className="grid gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Rent</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">₹{property.rent}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Deposit</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">₹{property.deposit}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {user?.role === 'tenant' ? (
                  <button onClick={handleInterest} className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95">
                    I'm Interested
                  </button>
                ) : (
                  <Link to="/tenant/login" className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">
                    Login as Tenant to Express Interest
                  </Link>
                )}
                <button className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">
                  Save Property
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-4">Call Owner: +91 98765 43210</div>
                <div className="rounded-3xl bg-slate-50 p-4">WhatsApp Owner</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
          <h2 className="text-2xl font-semibold text-slate-900">Owner information</h2>
          <div className="mt-6 rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            {user?.role === 'tenant' ? (
              <div className="grid gap-6 lg:grid-cols-[0.9fr_0.8fr]">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-700">
                      {property.ownerProfileImage ? (
                        <img src={property.ownerProfileImage} alt={property.ownerName} className="h-20 w-20 rounded-full object-cover" />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{property.ownerName}</p>
                      <p className="text-sm text-slate-500">{property.ownerEmail || 'No email available'}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Phone</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{property.ownerPhoneNumber || 'Not available'}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Verified</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{property.ownerVerificationStatus ? 'Verified' : 'Not verified'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 rounded-[32px] bg-white p-6 shadow-sm">
                  <a
                    href={property.ownerPhoneNumber ? `tel:${property.ownerPhoneNumber}` : '#'}
                    className={`inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 ${!property.ownerPhoneNumber ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    Call Owner
                  </a>
                  <a
                    href={property.ownerPhoneNumber ? `https://wa.me/${property.ownerPhoneNumber}` : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex w-full items-center justify-center rounded-3xl border border-emerald-600 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 ${!property.ownerPhoneNumber ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    WhatsApp Owner
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
                Please login to view owner contact details.
              </div>
            )}
          </div>
          <div className="mt-6 rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-900">Property owner</h3>
            <p className="mt-3 text-slate-600">{property.ownerName}</p>
            <p className="mt-1 text-sm text-slate-500">This contact section appears for verified tenants and keeps owner details private from guests.</p>
          </div>
        </div>
        <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
          <h2 className="text-2xl font-semibold text-slate-900">Location</h2>
          <div className="mt-6 h-[320px] overflow-hidden rounded-[28px] border border-slate-200">
            <iframe
              title="property-map"
              src={`https://maps.google.com/maps?q=${property.location}&z=14&output=embed`}
              className="h-full w-full"
            />
          </div>
          <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
            Nearby Places: Shopping mall, café district, gym, metro station and park.
          </div>
        </div>
      </div>

      {message ? <div className="rounded-3xl bg-emerald-50 p-5 text-emerald-800">{message}</div> : null}
    </div>
  );
}
