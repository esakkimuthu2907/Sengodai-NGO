const express = require('express');
const { submitContact, getMessages, replyMessage, markRead, deleteMessage } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.post('/', submitContact);

// Admin only
router.get('/', protect, authorize('admin'), getMessages);
router.put('/:id/reply', protect, authorize('admin'), replyMessage);
router.put('/:id/read', protect, authorize('admin'), markRead);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

module.exports = router;
