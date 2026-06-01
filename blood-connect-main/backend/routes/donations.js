const express = require('express');
const { getDonations, createDonation, updateDonation, deleteDonation } = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getDonations)
  .post(createDonation);

router.route('/:id')
  .put(authorize('admin'), updateDonation)
  .delete(authorize('admin'), deleteDonation);

module.exports = router;
