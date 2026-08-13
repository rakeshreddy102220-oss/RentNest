export type Role = 'owner' | 'tenant' | 'admin';

export interface UserPayload {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone_number?: string | null;
  profile_image?: string | null;
  verification_status?: number;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  type: string;
  bhk: string;
  rent: number;
  deposit: number;
  availability: string;
  city: string;
  area: string;
  images: string[];
  amenities: string[];
  ownerName: string;
  ownerPhoneNumber?: string | null;
  ownerEmail?: string | null;
  ownerProfileImage?: string | null;
  ownerVerificationStatus?: number;
  verified: boolean;
  location: string;
  status?: string;
}
