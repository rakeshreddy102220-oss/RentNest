import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProperty, deactivateProperty, getOwnerProperties, activateProperty } from '../utils/api';
import type { Property } from '../types';

const statusLabel = (status?: string) => {
  if (status === 'pending') return 'Pending review';
  if (status === 'approved') return 'Active';
  if (status === 'inactive') return 'Inactive';
  if (status === 'rejected') return 'Rejected';
  return 'Draft';
};

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const result = await getOwnerProperties();
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this property?')) return;
    await deleteProperty(id.toString());
    refresh();
  };

  const handleToggle = async (property: Property) => {
    if (property.status === 'inactive') {
      await activateProperty(property.id.toString());
    } else {
      await deactivateProperty(property.id.toString());
    }
    refresh();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-primary">Your Listings</p>
            <h1 className="text-4xl font-semibold text-slate-900">Manage all of your properties</h1>
            <p className="text-slate-600">Edit, activate, or remove listings from your RentNest portfolio.</p>
          </div>
          <Link
            to="/owner/add-property"
            className="inline-flex rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-95"
          >
            Add New Property
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[32px] border border-slate-200/70 bg-slate-50 p-10 text-center text-slate-500 shadow-sm">Loading your properties…</div>
      ) : properties.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
          <p className="text-lg font-semibold text-slate-900">No properties yet</p>
          <p className="mt-2">Create a new listing to start receiving tenant interest.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {properties.map((property) => (
            <div key={property.id} className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <img src={property.images[0]} alt={property.title} className="h-72 w-full object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-primary">{property.city}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{property.title}</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{statusLabel(property.status)}</span>
                  </div>
                  <p className="mt-4 text-slate-600">{property.description.slice(0, 130)}…</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{property.bhk}</div>
                    <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">₹{property.rent} / mo</div>
                    <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{property.area}</div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/properties/${property.id}`}
                      className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                    >
                      View Listing
                    </Link>
                    <Link
                      to={`/owner/properties/${property.id}/edit`}
                      className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggle(property)}
                      className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                    >
                      {property.status === 'inactive' ? 'Activate' : 'Deactivate'}
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
