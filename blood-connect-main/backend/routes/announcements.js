const express = require('express');
const { getAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAnnouncements)
  .post(authorize('admin'), createAnnouncement);

router.route('/:id')
  .delete(authorize('admin'), deleteAnnouncement);

module.exports = router;
