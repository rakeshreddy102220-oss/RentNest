import type { Property, UserPayload } from '../types';

const API_BASE = 'https://rentnest-backend-xxxx.onrender.com/api';

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('rentnest_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...authHeaders(),
    ...(typeof options.headers === 'object' && !Array.isArray(options.headers) ? options.headers : {})
  };

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    credentials: 'include',
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.message || response.statusText || 'Unable to complete request') as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const login = async (email: string, password: string) => {
  return apiRequest<{ token: string; user: UserPayload }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

export const signup = async (name: string, email: string, password: string, role: string, phone_number?: string) => {
  return apiRequest<{ token: string; user: UserPayload }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role, phone_number })
  });
};

export const loadProperties = async (query = '') => apiRequest<Property[]>(`/properties${query}`);
export const loadProperty = async (id: string) => apiRequest<Property>(`/properties/${id}`);
export const fetchMe = async () => apiRequest<UserPayload>('/auth/me');
export const fetchOwnerProfile = async () => apiRequest<UserPayload>('/properties/owner/profile');
export const updateOwnerProfile = async (formData: FormData) => apiRequest<UserPayload>('/properties/owner/profile', { method: 'PUT', body: formData });
export const expressInterest = async (propertyId: string) =>
  apiRequest('/properties/' + propertyId + '/interest', { method: 'POST' });

export const createProperty = async (formData: FormData) =>
  apiRequest<Property>('/properties', { method: 'POST', body: formData });
export const updateProperty = async (id: string, formData: FormData) =>
  apiRequest<Property>(`/properties/${id}`, { method: 'PUT', body: formData });
export const getOwnerProperties = async () => apiRequest<Property[]>('/properties/owner');
export const getOwnerSummary = async () =>
  apiRequest<{ totalListings: number; activeListings: number; pendingListings: number; interestedTenants: number }>('/properties/owner/summary');
export const getOwnerInterests = async () =>
  apiRequest<Array<{ id: number; interestDate: string; tenantName: string; tenantEmail: string; propertyId: number; propertyTitle: string }>>('/properties/owner/interests');
export const getAdminPendingProperties = async () => apiRequest<Property[]>('/properties/admin/pending');
export const getAdminSummary = async () =>
  apiRequest<{ totalUsers: number; totalOwners: number; totalTenants: number; totalProperties: number; pendingReviews: number }>('/properties/admin/summary');
export const approveProperty = async (id: string) => apiRequest(`/properties/${id}/approve`, { method: 'POST' });
export const rejectProperty = async (id: string) => apiRequest(`/properties/${id}/reject`, { method: 'POST' });
export const deleteProperty = async (id: string) => apiRequest(`/properties/${id}`, { method: 'DELETE' });
export const deactivateProperty = async (id: string) => apiRequest(`/properties/${id}/deactivate`, { method: 'POST' });
export const activateProperty = async (id: string) => apiRequest(`/properties/${id}/activate`, { method: 'POST' });
