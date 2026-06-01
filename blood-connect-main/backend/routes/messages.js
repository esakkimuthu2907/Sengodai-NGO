const express = require('express');
const { getMessages, getUserThread, sendMessage } = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMessages)
  .post(sendMessage);

router.route('/:userId')
  .get(authorize('admin'), getUserThread);

module.exports = router;
