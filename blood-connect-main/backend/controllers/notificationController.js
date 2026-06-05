const Notification = require('../models/Notification');

// @desc    Get all notifications for the logged in user / role
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const query = {};
    
    // Admins get admin notifications
    if (req.user.role === 'admin') {
      query.recipientRole = 'admin';
    } else {
      // Volunteers get their personal notifications or general notifications
      query.$or = [
        { recipient: req.user.id },
        { recipientRole: 'volunteer' },
        { recipientRole: 'all' }
      ];
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .populate('relatedRequest');

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark all notifications as read for current user
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'admin') {
      query.recipientRole = 'admin';
    } else {
      query.$or = [
        { recipient: req.user.id },
        { recipientRole: 'volunteer' },
        { recipientRole: 'all' }
      ];
    }

    await Notification.updateMany(query, { isRead: true });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
