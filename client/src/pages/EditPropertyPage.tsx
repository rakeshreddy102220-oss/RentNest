import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadProperty, updateProperty } from '../utils/api';
import type { Property } from '../types';

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [bhk, setBhk] = useState('');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [availability, setAvailability] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [amenities, setAmenities] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadProperty(id)
      .then((result) => {
        setProperty(result);
        setTitle(result.title);
        setDescription(result.description);
        setType(result.type);
        setBhk(result.bhk);
        setRent(String(result.rent));
        setDeposit(String(result.deposit));
        setAvailability(result.availability);
        setCity(result.city);
        setArea(result.area);
        setLocation(result.location);
        setImages(result.images.join(', '));
        setAmenities(result.amenities.join(', '));
      })
      .catch((error) => {
        console.error(error);
        setStatusMessage('Unable to load property details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    setLoading(true);
    setStatusMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', type);
      formData.append('bhk', bhk);
      formData.append('rent', rent);
      formData.append('deposit', deposit);
      formData.append('availability', availability);
      formData.append('city', city);
      formData.append('area', area);
      formData.append('location', location);
      formData.append('amenities', JSON.stringify(amenities.split(',').map((item) => item.trim()).filter(Boolean)));
      formData.append('existingImages', JSON.stringify(images.split(',').map((item) => item.trim()).filter(Boolean)));
      selectedFiles.forEach((file) => formData.append('images', file));

      await updateProperty(id, formData);
      navigate('/owner/properties');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to update property');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-12 shadow-glass text-center text-slate-500">Loading property details…</div>;
  }

  if (!property) {
    return <div className="rounded-[36px] border border-rose-200 bg-rose-50 p-12 shadow-glass text-center text-rose-700">Property not found.</div>;
  }

  return (
    <div className="rounded-[36px] border border-slate-200/70 bg-white/90 p-8 shadow-glass">
      <div className="mb-8 space-y-4">
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Edit Listing</p>
        <h1 className="text-4xl font-semibold text-slate-900">Update your property details</h1>
        <p className="text-slate-600">Make corrections or improve your listing to attract more tenants.</p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-6">
        {statusMessage ? <div className="rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{statusMessage}</div> : null}
        <label className="space-y-2 text-sm text-slate-700">
          Property Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            required
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            City
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Area
            <input
              value={area}
              onChange={(event) => setArea(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Rent
            <input
              value={rent}
              onChange={(event) => setRent(event.target.value)}
              required
              type="number"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Deposit
            <input
              value={deposit}
              onChange={(event) => setDeposit(event.target.value)}
              required
              type="number"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Available From
            <input
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              required
              type="date"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Property Type
            <input
              value={type}
              onChange={(event) => setType(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            BHK
            <input
              value={bhk}
              onChange={(event) => setBhk(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Amenities
            <input
              value={amenities}
              onChange={(event) => setAmenities(event.target.value)}
              placeholder="WiFi, Parking, Balcony"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-slate-700">
          Images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setSelectedFiles(files);
              setPreviews(files.map((f) => URL.createObjectURL(f)));
            }}
            className="w-full outline-none"
          />
          <input
            value={images}
            onChange={(event) => setImages(event.target.value)}
            placeholder="Comma-separated image URLs"
            className="w-full mt-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {previews.length > 0 ? (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {previews.map((src, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <img key={idx} src={src} alt={`preview-${idx}`} className="h-20 w-28 rounded-md object-cover" />
              ))}
            </div>
          ) : null}
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Map Location
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Latitude,Longitude"
            required
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Updating…' : 'Update Property'}
        </button>
      </form>
    </div>
  );
}
