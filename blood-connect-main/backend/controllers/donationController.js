const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Get all donations (admin) or own donations (volunteer)
// @route   GET /api/donations
// @access  Private
exports.getDonations = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.donor = req.user.id;
    }
    const donations = await Donation.find(query)
      .populate('donor', 'name email bloodGroup')
      .populate('camp', 'name location date')
      .sort({ donationDate: -1 })
      .lean();

    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a donation record
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res) => {
  try {
    req.body.donor = req.user.id;
    req.body.bloodGroup = req.user.bloodGroup;

    // Check 90-day cooldown
    const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
    const user = await User.findById(req.user.id);
    if (user.lastDonationDate) {
      const timeSince = Date.now() - new Date(user.lastDonationDate).getTime();
      if (timeSince < NINETY_DAYS) {
        const daysLeft = Math.ceil((NINETY_DAYS - timeSince) / (1000 * 60 * 60 * 24));
        return res.status(400).json({
          success: false,
          message: `Not eligible yet. You can donate again in ${daysLeft} days.`
        });
      }
    }

    const donation = await Donation.create(req.body);

    // Update user's last donation date and count
    await User.findByIdAndUpdate(req.user.id, {
      lastDonationDate: donation.donationDate,
      isAvailableForDonation: false,
      $inc: { donationCount: 1 }
    });

    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private/Admin
exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    res.status(200).json({ success: true, data: donation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private/Admin
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    await Donation.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
