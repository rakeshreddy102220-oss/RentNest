import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'rentnest.db');

export let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function initializeDatabase() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      phone TEXT,
      phone_number TEXT,
      profile_image TEXT,
      verification_status INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL,
      bhk TEXT NOT NULL,
      rent INTEGER NOT NULL,
      deposit INTEGER NOT NULL,
      availability TEXT NOT NULL,
      city TEXT NOT NULL,
      area TEXT NOT NULL,
      location TEXT NOT NULL,
      images TEXT NOT NULL,
      amenities TEXT NOT NULL,
      verified INTEGER DEFAULT 1,
      status TEXT DEFAULT 'approved',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      tenant_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
      FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  const columnInfoResult = await db.all('PRAGMA table_info(users)');
  const columnInfo = Array.isArray(columnInfoResult)
    ? (columnInfoResult as Array<{ name: string }>)
    : [];
  const columnNames = columnInfo.map((column) => column.name);
  if (!columnNames.includes('phone_number')) {
    await db.run('ALTER TABLE users ADD COLUMN phone_number TEXT');
  }
  if (!columnNames.includes('profile_image')) {
    await db.run('ALTER TABLE users ADD COLUMN profile_image TEXT');
  }
  if (!columnNames.includes('verification_status')) {
    await db.run('ALTER TABLE users ADD COLUMN verification_status INTEGER DEFAULT 0');
  }
  await db.run('UPDATE users SET phone_number = phone WHERE phone_number IS NULL AND phone IS NOT NULL');

  const ownerCount = await db.get<{ count: number }>('SELECT COUNT(*) AS count FROM users WHERE role = ?', 'owner');
  if (!ownerCount || ownerCount.count === 0) {
    const ownerPassword = await bcrypt.hash('owner123', 10);
    const tenantPassword = await bcrypt.hash('tenant123', 10);
    await db.run(
      'INSERT INTO users (name, email, password, role, phone, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
      'Owner One',
      'owner@rentnest.com',
      ownerPassword,
      'owner',
      '9876543210',
      '9876543210'
    );
    await db.run(
      'INSERT INTO users (name, email, password, role, phone, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
      'Tenant One',
      'tenant@rentnest.com',
      tenantPassword,
      'tenant',
      '9876501234',
      '9876501234'
    );

    const owner = await db.get<{ id: number }>('SELECT id FROM users WHERE email = ?', 'owner@rentnest.com');
    if (owner) {
      await db.run(
        'INSERT INTO properties (owner_id, title, description, type, bhk, rent, deposit, availability, city, area, location, images, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        owner.id,
        'Moonlight Suites',
        'A modern 3BHK apartment with balcony, WiFi and premium amenities near the city center.',
        'Apartment',
        '3BHK',
        28500,
        57000,
        '2026-08-10',
        'Mumbai',
        'Bandra West',
        '19.0544,72.8404',
        JSON.stringify([
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
        ]),
        JSON.stringify(['Parking', 'WiFi', 'AC', 'Balcony', 'Security'])
      );
    }
  }

  const existingAdmin = await db.get<{ id: number }>('SELECT id FROM users WHERE email = ?', 'rakesh@rentnest.com');
  if (!existingAdmin) {
    const adminPassword = await bcrypt.hash('Rakesh@123', 10);
    await db.run('INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)', 'Rakesh Admin', 'rakesh@rentnest.com', adminPassword, 'admin', '9000000000');
  }
}
