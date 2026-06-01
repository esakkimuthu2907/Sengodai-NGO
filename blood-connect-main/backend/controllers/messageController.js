const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get messages/threads
// @route   GET /api/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'admin') {
      // Admin gets thread summary list
      const messages = await Message.find({
        $or: [{ sender: userId }, { receiver: userId }]
      })
      .populate('sender', 'firstName lastName email role phone location')
      .populate('receiver', 'firstName lastName email role phone location')
      .sort({ createdAt: -1 });

      const threads = {};
      messages.forEach(msg => {
        const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
        if (!otherUser || otherUser._id.toString() === userId) return;
        const otherId = otherUser._id.toString();

        if (!threads[otherId]) {
          threads[otherId] = {
            user: otherUser,
            lastMessage: msg.content,
            updatedAt: msg.createdAt,
            unreadCount: (msg.receiver._id.toString() === userId && !msg.isRead) ? 1 : 0
          };
        } else if (msg.receiver._id.toString() === userId && !msg.isRead) {
          threads[otherId].unreadCount++;
        }
      });

      return res.status(200).json({ success: true, data: Object.values(threads) });
    } else {
      // Regular user gets their complete chat history with the admin
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        return res.status(200).json({ success: true, data: [] });
      }

      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: admin._id },
          { sender: admin._id, receiver: userId }
        ]
      })
      .populate('sender', 'firstName lastName email')
      .populate('receiver', 'firstName lastName email')
      .sort({ createdAt: 1 });

      // Mark received messages as read
      await Message.updateMany(
        { sender: admin._id, receiver: userId, isRead: false },
        { isRead: true }
      );

      return res.status(200).json({ success: true, data: messages });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get user thread (Admin only)
// @route   GET /api/messages/:userId
// @access  Private/Admin
exports.getUserThread = async (req, res) => {
  try {
    const adminId = req.user.id;
    const userId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: adminId, receiver: userId },
        { sender: userId, receiver: adminId }
      ]
    })
    .populate('sender', 'firstName lastName email')
    .populate('receiver', 'firstName lastName email')
    .sort({ createdAt: 1 });

    // Mark messages as read by admin
    await Message.updateMany(
      { sender: userId, receiver: adminId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const userRole = req.user.role;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content required' });
    }

    let receiverId;

    if (userRole === 'admin') {
      receiverId = req.body.receiverId;
      if (!receiverId) {
        return res.status(400).json({ success: false, message: 'Receiver ID is required for admin' });
      }
    } else {
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin user not found' });
      }
      receiverId = admin._id;
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content.trim()
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'firstName lastName email role')
      .populate('receiver', 'firstName lastName email role');

    // Socket.io real-time broadcast
    const io = req.app.get('io');
    if (io) {
      io.to(senderId.toString()).emit('new_message', populated);
      io.to(receiverId.toString()).emit('new_message', populated);
      io.emit('new_message', populated); // broadcast fallback
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
