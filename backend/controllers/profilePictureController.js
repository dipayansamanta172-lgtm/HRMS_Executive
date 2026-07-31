const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const db = require('../config/db');
const { logAction } = require('../utils/auditLogger');

const profilePictureController = {
  uploadAvatar: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please attach a valid file.' });
    }

    const localFilePath = req.file.path;
    const employeeId = req.user.employee ? req.user.employee.id : null;

    if (!employeeId) {
      // Attempt clean up of local file
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return res.status(400).json({ message: 'User is not associated with an employee profile.' });
    }

    try {
      let avatarUrl = '';
      
      // Check if Cloudinary is configured
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        console.warn('Cloudinary not configured. Returning local relative path.');
        const protocol = req.protocol;
        const host = req.get('host');
        avatarUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      } else {
        console.log(`Uploading profile picture ${req.file.originalname} to Cloudinary folder profile_pictures...`);
        const uploadOptions = {
          folder: 'profile_pictures',
          resource_type: 'image',
        };

        const result = await cloudinary.uploader.upload(localFilePath, uploadOptions);
        avatarUrl = result.secure_url;
      }

      // Clean up local temp file asynchronously
      fs.unlink(localFilePath, (err) => {
        if (err) console.error('Failed to delete temporary local file:', err);
      });

      // Save to database
      await db.query(
        'UPDATE employees SET photo = ? WHERE id = ?',
        [avatarUrl, employeeId]
      );

      // Audit log
      await logAction(req.user.id, 'Profile Picture Updated', 'employees', employeeId);

      return res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully.',
        url: avatarUrl,
      });
    } catch (err) {
      console.error('Profile picture upload error:', err);
      
      // Attempt clean up of local file on error
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      
      return res.status(500).json({ message: 'Failed to upload profile picture to cloud storage.' });
    }
  },
};

module.exports = profilePictureController;
