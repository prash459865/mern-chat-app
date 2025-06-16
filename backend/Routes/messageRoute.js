import express from 'express';
import { allUsers } from '../controllers/messageController.js';
import protectedRoute from '../middleware/authMiddleware.js';
import { allMessage } from '../controllers/messageController.js';
import { sendMessage } from '../controllers/messageController.js';
import { updateProfileImage } from '../controllers/messageController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/access-all-users', protectedRoute, allUsers);
router.post('/allMessages', protectedRoute, allMessage);
router.post('/send-message',protectedRoute,upload.single('file'),sendMessage)
router.post('/update-profile-image',protectedRoute,upload.single('profileImage'),updateProfileImage)

export default router;