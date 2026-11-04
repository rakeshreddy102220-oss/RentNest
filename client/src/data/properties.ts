import type { Property } from '../types';

export const propertyData: Property[] = [
  {
    id: 1,
    title: 'Moonlight Suites',
    description: 'A modern 3BHK apartment with balcony, WiFi and premium amenities near the city center.',
    type: 'Apartment',
    bhk: '3BHK',
    rent: 28500,
    deposit: 57000,
    availability: '2026-08-10',
    city: 'Mumbai',
    area: 'Bandra West',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Parking', 'WiFi', 'AC', 'Balcony', 'Security'],
    ownerName: 'Aarav Sharma',
    verified: true,
    location: '19.0544,72.8404'
  },
  {
    id: 2,
    title: 'Urban Loft',
    description: 'Bright 2BHK loft-style apartment with work-from-home-friendly spaces and smart access.',
    type: 'Apartment',
    bhk: '2BHK',
    rent: 24500,
    deposit: 49000,
    availability: '2026-09-01',
    city: 'Bengaluru',
    area: 'Indiranagar',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1472220625704-91e1462799b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['WiFi', 'Lift', 'Security'],
    ownerName: 'Meera Patel',
    verified: true,
    location: '12.9716,77.5946'
  }
];
