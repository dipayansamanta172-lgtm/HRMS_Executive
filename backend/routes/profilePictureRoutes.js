const express = require('express');
const router = express.Router();
const profilePictureController = require('../controllers/profilePictureController');
const upload = require('../middleware/profileImageUploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/', authMiddleware, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Capture multer file filter error or limit error and return custom message
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, profilePictureController.uploadAvatar);

module.exports = router;
