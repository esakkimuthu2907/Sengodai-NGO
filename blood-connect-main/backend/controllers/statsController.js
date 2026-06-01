const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Camp = require('../models/Camp');
const Donation = require('../models/Donation');

// @desc    Get public homepage statistics
// @route   GET /api/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const [totalDonors, totalRequests, fulfilledRequests, totalCamps] = await Promise.all([
      User.countDocuments({ role: 'volunteer' }).lean(),
      BloodRequest.countDocuments().lean(),
      BloodRequest.countDocuments({ status: 'Fulfilled' }).lean(),
      Camp.countDocuments().lean()
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDonors,
        totalRequests,
        livesSaved: fulfilledRequests,
        campsOrganized: totalCamps
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get urgent blood requests (public)
// @route   GET /api/requests/urgent
// @access  Public
exports.getUrgentRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      urgency: { $in: ['High', 'Critical'] },
      status: { $in: ['Pending', 'Approved'] }
    })
      .sort({ urgency: -1, createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get upcoming camps (public)
// @route   GET /api/camps/upcoming
// @access  Public
exports.getUpcomingCamps = async (req, res) => {
  try {
    const camps = await Camp.find({
      date: { $gt: new Date() },
      status: 'Upcoming'
    })
      .sort({ date: 1 })
      .limit(5)
      .populate('organizer', 'name')
      .lean();

    res.status(200).json({ success: true, data: camps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get available donors (filterable)
// @route   GET /api/donors
// @access  Private
exports.getDonors = async (req, res) => {
  try {
    const { bloodGroup, location, available } = req.query;
    const query = { role: 'volunteer' };

    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (available === 'true') query.isAvailableForDonation = true;

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const donors = await User.find(query)
      .select('-password')
      .skip(startIndex)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: donors.length,
      total,
      pagination: { page, limit, pages: Math.ceil(total / limit) },
      data: donors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
