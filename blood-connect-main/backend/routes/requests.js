const express = require('express');
const { getRequests, getRequest, createRequest, updateRequest, deleteRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getRequests)
  .post(protect, createRequest);

router.route('/:id')
  .get(getRequest)
  .put(protect, updateRequest)
  .delete(protect, deleteRequest);

module.exports = router;
