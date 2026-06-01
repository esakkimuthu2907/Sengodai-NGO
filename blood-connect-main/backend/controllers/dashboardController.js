const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Camp = require('../models/Camp');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRequests = await BloodRequest.countDocuments();
    const fulfilledRequests = await BloodRequest.countDocuments({ status: 'Fulfilled' });
    const upcomingCamps = await Camp.countDocuments({ date: { $gt: Date.now() } });

    // Blood group stats distribution
    const bloodGroupStats = await User.aggregate([
      { $match: { role: { $in: ['user', 'volunteer'] } } },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
    ]);

    // Monthly requests trend (Aggregation)
    const monthlyRequests = await BloodRequest.aggregate([
      { 
        $group: { 
          _id: { $month: "$createdAt" }, 
          total: { $sum: 1 },
          fulfilled: { $sum: { $cond: [{ $eq: ["$status", "Fulfilled"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } } // Sort by month ascending
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRequests,
        fulfilledRequests,
        upcomingCamps,
        bloodGroupStats,
        monthlyRequests
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get Volunteer Dashboard Stats
// @route   GET /api/dashboard/volunteer
// @access  Private
exports.getVolunteerStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Donation Cooldown Logic (90 days)
    const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
    let eligible = true;
    let daysUntilEligible = 0;

    if (user.lastDonationDate) {
      const timeSinceLastDonation = Date.now() - new Date(user.lastDonationDate).getTime();
      if (timeSinceLastDonation < NINETY_DAYS) {
        eligible = false;
        daysUntilEligible = Math.ceil((NINETY_DAYS - timeSinceLastDonation) / (1000 * 60 * 60 * 24));
      }
    }

    // Matching requests for volunteer's blood group
    const matchingRequests = await BloodRequest.find({
      bloodGroup: user.bloodGroup,
      status: { $in: ['Pending', 'Approved'] }
    }).sort({ urgency: -1, createdAt: -1 }).limit(5);

    // Upcoming Camps
    const upcomingCamps = await Camp.find({ date: { $gt: Date.now() } }).sort({ date: 1 }).limit(3);

    res.status(200).json({
      success: true,
      data: {
        eligible,
        daysUntilEligible,
        lastDonationDate: user.lastDonationDate,
        matchingRequests,
        upcomingCamps
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
