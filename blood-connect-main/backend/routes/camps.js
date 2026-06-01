const express = require('express');
const { getCamps, getCamp, createCamp, updateCamp, deleteCamp } = require('../controllers/campController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getCamps)
  .post(protect, authorize('admin'), createCamp);

router.route('/:id')
  .get(getCamp)
  .put(protect, authorize('admin'), updateCamp)
  .delete(protect, authorize('admin'), deleteCamp);

module.exports = router;
