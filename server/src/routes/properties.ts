import { type Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { db } from '../db.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { files: 10, fileSize: 5 * 1024 * 1024 } });
const router = Router();

// Upload endpoint: accepts JSON with files [{ filename, data: '<base64>' }]
router.post('/upload', authMiddleware('owner'), async (req: AuthRequest, res: Response) => {
  try {
    const files = req.body.files as Array<{ filename: string; data: string }>;
    if (!Array.isArray(files) || files.length === 0) return res.status(400).json({ message: 'No files provided' });

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const urls: string[] = [];
    for (const file of files) {
      const name = `${Date.now()}-${file.filename.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      const buffer = Buffer.from(file.data, 'base64');
      const filePath = path.join(uploadDir, name);
      await fs.promises.writeFile(filePath, buffer);
      urls.push(`/uploads/${name}`);
    }

    res.json({ urls });
  } catch (err) {
    console.error('Upload failed', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

router.get('/', async (req, res) => {
  const filters = [];
  const values = [];
  const { city, area, bhk, minRent, maxRent, type, amenities, status } = req.query;

  if (city) {
    filters.push('city LIKE ?');
    values.push(`%${city}%`);
  }
  if (area) {
    filters.push('area LIKE ?');
    values.push(`%${area}%`);
  }
  if (bhk) {
    filters.push('bhk = ?');
    values.push(bhk);
  }
  if (type) {
    filters.push('type = ?');
    values.push(type);
  }
  if (minRent) {
    filters.push('rent >= ?');
    values.push(minRent);
  }
  if (maxRent) {
    filters.push('rent <= ?');
    values.push(maxRent);
  }
  if (amenities) {
    filters.push('amenities LIKE ?');
    values.push(`%${amenities}%`);
  }
  if (status) {
    filters.push('status = ?');
    values.push(status);
  }

  const query = `SELECT p.*, u.name AS ownerName FROM properties p JOIN users u ON p.owner_id = u.id ${
    filters.length ? 'WHERE ' + filters.join(' AND ') : ''
  } ORDER BY p.created_at DESC`;

  const properties = await db.all(query, ...values);
  const formatted = properties.map((property) => ({
    ...property,
    images: JSON.parse(property.images),
    amenities: JSON.parse(property.amenities),
    verified: Boolean(property.verified)
  }));
  res.json(formatted);
});

router.get('/owner', authMiddleware('owner'), async (req: AuthRequest, res: Response) => {
  const properties = await db.all('SELECT * FROM properties WHERE owner_id = ? ORDER BY created_at DESC', req.user!.id);
  res.json(properties.map((property) => ({
    ...property,
    images: JSON.parse(property.images),
    amenities: JSON.parse(property.amenities),
    verified: Boolean(property.verified)
  })));
});

router.get('/owner/profile', authMiddleware('owner'), async (req: AuthRequest, res: Response) => {
  const profile = await db.get(
    'SELECT id, name, email, phone_number, profile_image, verification_status FROM users WHERE id = ?',
    req.user!.id
  );
  if (!profile) {
    return res.status(404).json({ message: 'Owner profile not found' });
  }
  res.json(profile);
});

router.put('/owner/profile', authMiddleware('owner'), upload.single('profile_image'), async (req: AuthRequest, res: Response) => {
  const { name, email, phone_number } = req.body;

  if (!name || !email || !phone_number) {
    return res.status(400).json({ message: 'Name, email, and phone number are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }
  const normalizedPhone = String(phone_number).replace(/\D/g, '');
  if (normalizedPhone.length !== 10) {
    return res.status(400).json({ message: 'Phone number must contain exactly 10 digits' });
  }

  const profileImageUrl = req.file
    ? `/uploads/${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')}`
    : undefined;

  if (req.file) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, profileImageUrl!.replace('/uploads/', ''));
    fs.writeFileSync(filePath, req.file.buffer);
  }

  await db.run(
    'UPDATE users SET name = ?, email = ?, phone_number = ?, profile_image = COALESCE(?, profile_image) WHERE id = ?',
    name.trim(),
    normalizedEmail,
    normalizedPhone,
    profileImageUrl,
    req.user!.id
  );

  const updated = await db.get(
    'SELECT id, name, email, phone_number, profile_image, verification_status FROM users WHERE id = ?',
    req.user!.id
  );
  res.json(updated);
});

router.get('/owner/interests', authMiddleware('owner'), async (req: AuthRequest, res: Response) => {
  const interests = await db.all(
    `SELECT i.id, i.created_at AS interestDate, u.name AS tenantName, u.email AS tenantEmail, p.id AS propertyId, p.title AS propertyTitle
     FROM interests i
     JOIN properties p ON i.property_id = p.id
     JOIN users u ON i.tenant_id = u.id
     WHERE p.owner_id = ?
     ORDER BY i.created_at DESC`,
    req.user!.id
  );
  res.json(interests);
});

router.get('/owner/summary', authMiddleware('owner'), async (req: AuthRequest, res: Response) => {
  const totalListings = await db.get('SELECT COUNT(*) AS count FROM properties WHERE owner_id = ?', req.user!.id);
  const activeListings = await db.get('SELECT COUNT(*) AS count FROM properties WHERE owner_id = ? AND status = ?', req.user!.id, 'approved');
  const pendingListings = await db.get('SELECT COUNT(*) AS count FROM properties WHERE owner_id = ? AND status = ?', req.user!.id, 'pending');
  const interestedTenants = await db.get(
    `SELECT COUNT(*) AS count FROM interests i
     JOIN properties p ON i.property_id = p.id
     WHERE p.owner_id = ?`,
    req.user!.id
  );
  res.json({
    totalListings: totalListings.count || 0,
    activeListings: activeListings.count || 0,
    pendingListings: pendingListings.count || 0,
    interestedTenants: interestedTenants.count || 0
  });
});

router.get('/admin/pending', authMiddleware('admin'), async (req, res) => {
  const properties = await db.all(
    'SELECT p.*, u.name AS ownerName FROM properties p JOIN users u ON p.owner_id = u.id WHERE p.status = ? ORDER BY p.created_at DESC',
    'pending'
  );
  res.json(properties.map((property) => ({
    ...property,
    images: JSON.parse(property.images),
    amenities: JSON.parse(property.amenities),
    verified: Boolean(property.verified)
  })));
});

router.get('/admin/summary', authMiddleware('admin'), async (req, res) => {
  const totalUsers = await db.get('SELECT COUNT(*) AS count FROM users');
  const totalOwners = await db.get('SELECT COUNT(*) AS count FROM users WHERE role = ?', 'owner');
  const totalTenants = await db.get('SELECT COUNT(*) AS count FROM users WHERE role = ?', 'tenant');
  const totalProperties = await db.get('SELECT COUNT(*) AS count FROM properties');
  const pendingReviews = await db.get('SELECT COUNT(*) AS count FROM properties WHERE status = ?', 'pending');

  res.json({
    totalUsers: totalUsers.count || 0,
    totalOwners: totalOwners.count || 0,
    totalTenants: totalTenants.count || 0,
    totalProperties: totalProperties.count || 0,
    pendingReviews: pendingReviews.count || 0
  });
});

router.post('/', authMiddleware('owner'), upload.array('images'), async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    type,
    bhk,
    rent,
    deposit,
    availability,
    city,
    area,
    location,
    existingImages,
    amenities
  } = req.body;

  if (!title || !description || !type || !bhk || !rent || !deposit || !availability || !city || !area || !location || !amenities) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existingImagesList = typeof existingImages === 'string' && existingImages ? JSON.parse(existingImages) : Array.isArray(existingImages) ? existingImages : [];
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const uploadedUrls = (req.files as Express.Multer.File[] | undefined)?.map((file) => {
    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/${filename}`;
  }) || [];

  const allImages = [...existingImagesList, ...uploadedUrls];

  const result = await db.run(
    'INSERT INTO properties (owner_id, title, description, type, bhk, rent, deposit, availability, city, area, location, images, amenities, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    req.user!.id,
    title,
    description,
    type,
    bhk,
    rent,
    deposit,
    availability,
    city,
    area,
    location,
    JSON.stringify(allImages),
    JSON.stringify(typeof amenities === 'string' ? JSON.parse(amenities) : amenities),
    'pending'
  );

  const property = await db.get('SELECT * FROM properties WHERE id = ?', result.lastID);
  res.status(201).json({
    ...property,
    images: JSON.parse(property.images),
    amenities: JSON.parse(property.amenities),
    verified: Boolean(property.verified)
  });
});

router.delete('/:id', authMiddleware('owner'), async (req: AuthRequest, res: Response) => {
  const property = await db.get('SELECT owner_id FROM properties WHERE id = ?', req.params.id);
  if (!property || property.owner_id !== req.user!.id) {
    return res.status(404).json({ message: 'Property not found or unauthorized' });
  }
  await db.run('DELETE FROM properties WHERE id = ?', req.params.id);
  res.json({ message: 'Property deleted' });
});

router.put('/:id', authMiddleware('owner'), upload.array('images'), async (req: AuthRequest, res: Response) => {
  const property = await db.get('SELECT owner_id FROM properties WHERE id = ?', req.params.id);
  if (!property || property.owner_id !== req.user!.id) {
    return res.status(404).json({ message: 'Property not found or unauthorized' });
  }

  const {
    title,
    description,
    type,
    bhk,
    rent,
    deposit,
    availability,
    city,
    area,
    location,
    existingImages,
    amenities
  } = req.body;

  if (!title || !description || !type || !bhk || !rent || !deposit || !availability || !city || !area || !location || !amenities) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existingImagesList = typeof existingImages === 'string' && existingImages ? JSON.parse(existingImages) : Array.isArray(existingImages) ? existingImages : [];
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const uploadedUrls = (req.files as Express.Multer.File[] | undefined)?.map((file) => {
    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/${filename}`;
  }) || [];

  const allImages = [...existingImagesList, ...uploadedUrls];

  await db.run(
    `UPDATE properties SET title = ?, description = ?, type = ?, bhk = ?, rent = ?, deposit = ?, availability = ?, city = ?, area = ?, location = ?, images = ?, amenities = ? WHERE id = ?`,
    title,
    description,
    type,
    bhk,
    rent,
    deposit,
    availability,
    city,
    area,
    location,
    JSON.stringify(allImages),
    JSON.stringify(typeof amenities === 'string' ? JSON.parse(amenities) : amenities),
    req.params.id
  );

  const updated = await db.get('SELECT * FROM properties WHERE id = ?', req.params.id);
  res.json({
    ...updated,
    images: JSON.parse(updated.images),
    amenities: JSON.parse(updated.amenities),
    verified: Boolean(updated.verified)
  });
});

router.post('/:id/activate', authMiddleware('owner'), async (req: AuthRequest, res: Response) => {
  const property = await db.get('SELECT owner_id FROM properties WHERE id = ?', req.params.id);
  if (!property || property.owner_id !== req.user!.id) {
    return res.status(404).json({ message: 'Property not found or unauthorized' });
  }
  await db.run('UPDATE properties SET status = ? WHERE id = ?', 'approved', req.params.id);
  res.json({ message: 'Property activated' });
});

router.post('/:id/deactivate', authMiddleware('owner'), async (req: AuthRequest, res: Response) => {
  const property = await db.get('SELECT owner_id FROM properties WHERE id = ?', req.params.id);
  if (!property || property.owner_id !== req.user!.id) {
    return res.status(404).json({ message: 'Property not found or unauthorized' });
  }
  await db.run('UPDATE properties SET status = ? WHERE id = ?', 'inactive', req.params.id);
  res.json({ message: 'Property deactivated' });
});

router.post('/:id/approve', authMiddleware('admin'), async (req: AuthRequest, res: Response) => {
  const property = await db.get('SELECT id FROM properties WHERE id = ?', req.params.id);
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  await db.run('UPDATE properties SET status = ? WHERE id = ?', 'approved', req.params.id);
  res.json({ message: 'Property approved' });
});

router.post('/:id/reject', authMiddleware('admin'), async (req: AuthRequest, res: Response) => {
  const property = await db.get('SELECT id FROM properties WHERE id = ?', req.params.id);
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  await db.run('UPDATE properties SET status = ? WHERE id = ?', 'rejected', req.params.id);
  res.json({ message: 'Property rejected' });
});

router.get('/:id', async (req, res) => {
  const property = await db.get(
    `SELECT p.*, u.name AS ownerName, u.phone_number AS ownerPhoneNumber, u.email AS ownerEmail, u.profile_image AS ownerProfileImage, u.verification_status AS ownerVerificationStatus
     FROM properties p
     JOIN users u ON p.owner_id = u.id
     WHERE p.id = ?`,
    req.params.id
  );
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  res.json({
    ...property,
    images: JSON.parse(property.images),
    amenities: JSON.parse(property.amenities),
    verified: Boolean(property.verified)
  });
});

router.post('/:id/interest', authMiddleware('tenant'), async (req: AuthRequest, res: Response) => {
  const property = await db.get('SELECT id FROM properties WHERE id = ?', req.params.id);
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  await db.run('INSERT INTO interests (property_id, tenant_id) VALUES (?, ?)', req.params.id, req.user!.id);
  res.json({ message: 'Interest recorded' });
});

export default router;
