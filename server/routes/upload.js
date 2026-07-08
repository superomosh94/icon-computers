import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'));

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, .png, .webp files are allowed'));
    }
  },
});

const router = Router();

// POST /api/upload — upload image(s)
router.post('/', requireAuth, upload.array('photos', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const urls = [];

    for (const file of req.files) {
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.webp`;
      const outputPath = path.join(uploadDir, uniqueName);

      // Compress and convert to webp
      await sharp(file.buffer)
        .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      urls.push(`/uploads/${uniqueName}`);
    }

    res.json({ urls });
  } catch (err) {
    next(err);
  }
});

// POST /api/upload/single — upload single image
router.post('/single', requireAuth, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.webp`;
    const outputPath = path.join(uploadDir, uniqueName);

    await sharp(req.file.buffer)
      .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    res.json({ url: `/uploads/${uniqueName}` });
  } catch (err) {
    next(err);
  }
});

export default router;
