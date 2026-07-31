const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File Filter for profile pictures (JPG, JPEG, PNG, WEBP)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const allowedMimetypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const mimetype = allowedMimetypes.includes(file.mimetype);

  if (mimetype || extname) {
    return cb(null, true);
  }
  cb(new Error('Invalid image format. Profile pictures must be JPG, JPEG, PNG, or WEBP.'));
};

const profileImageUploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max limit
});

module.exports = profileImageUploadMiddleware;
