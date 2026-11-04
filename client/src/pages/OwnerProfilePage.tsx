import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchOwnerProfile, updateOwnerProfile } from '../utils/api';
import type { UserPayload } from '../types';

export default function OwnerProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<UserPayload | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOwnerProfile()
      .then((data) => {
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
        setPhoneNumber(data.phone_number ?? '');
        setPreview(data.profile_image ?? '');
      })
      .catch(() => {
        setStatusMessage('Unable to load profile.');
      });
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone_number', phoneNumber);
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }

      const updated = await updateOwnerProfile(formData);
      setProfile(updated);
      setUser(updated);
      setPreview(updated.profile_image ?? preview);
      setStatusMessage('Profile updated successfully.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-[36px] border border-slate-200/80 bg-white/90 p-10 shadow-glass">
      <div className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.32em] text-primary">Owner profile</p>
        <h1 className="text-4xl font-semibold text-slate-900">Update your contact details</h1>
        <p className="max-w-2xl text-slate-600">Keep your owner profile up to date so tenants can connect with you confidently.</p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-6">
        {statusMessage ? <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{statusMessage}</div> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Email address
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Phone number
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              type="tel"
              maxLength={10}
              required
              placeholder="10 digit phone number"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Profile picture
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setProfileImage(file);
                if (file) setPreview(URL.createObjectURL(file));
              }}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
            />
          </label>
        </div>
        <div className="flex flex-col items-start gap-4 rounded-[32px] border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-5xl text-slate-700">
              {preview ? <img src={preview} alt="Profile preview" className="h-full w-full object-cover" /> : <span>👤</span>}
            </div>
            <div>
              <p className="text-sm text-slate-500">Profile image preview</p>
              <p className="text-lg font-semibold text-slate-900">{profile?.name || 'Owner profile'}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">Optional profile picture for the Owner Information card.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving profile…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
