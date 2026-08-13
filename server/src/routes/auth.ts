import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const SECRET = process.env.JWT_SECRET || 'rentnest-secret';
const router = Router();

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isStrongPassword = (password: string) =>
  password.length >= 8 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

router.post('/signup', async (req, res) => {
  const { name, email, password, role, phone_number } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }
  if (name.trim().length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters' });
  }
  if (!isStrongPassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters and include upper/lowercase letters, a number, and a symbol' });
  }
  if (role === 'admin') {
    return res.status(403).json({ message: 'Admin registration is disabled. Use the seeded admin account.' });
  }
  if (!['owner', 'tenant'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role selected' });
  }
  if (role === 'owner') {
    const phoneValidation = String(phone_number || '').replace(/\D/g, '');
    if (phoneValidation.length !== 10) {
      return res.status(400).json({ message: 'Owner phone number must contain exactly 10 digits' });
    }
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (name, email, password, role, phone_number) VALUES (?, ?, ?, ?, ?)',
      name.trim(),
      normalizedEmail,
      hashed,
      role,
      role === 'owner' ? String(phone_number).replace(/\D/g, '') : null
    );
    const user = {
      id: result.lastID as number,
      name: name.trim(),
      email: normalizedEmail,
      role,
      phone_number: role === 'owner' ? String(phone_number).replace(/\D/g, '') : null,
      profile_image: null,
      verification_status: 0
    };
    const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const normalizedEmail = normalizeEmail(email);
  const user = await db.get(
    'SELECT id, name, email, password, role, phone_number, profile_image, verification_status FROM users WHERE email = ?',
    normalizedEmail
  );
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const payload = {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    phone_number: user.phone_number || null,
    profile_image: user.profile_image || null,
    verification_status: user.verification_status || 0
  };
  const token = jwt.sign(payload, SECRET, { expiresIn: '7d' });
  res.json({ token, user: payload });
});

router.get('/me', authMiddleware(), (req: AuthRequest, res) => {
  res.json(req.user);
});

export default router;
