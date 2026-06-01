const express = require('express');
const { getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getGallery)
  .post(protect, authorize('admin'), createGalleryItem);

router.route('/:id')
  .put(protect, authorize('admin'), updateGalleryItem)
  .delete(protect, authorize('admin'), deleteGalleryItem);

module.exports = router;
