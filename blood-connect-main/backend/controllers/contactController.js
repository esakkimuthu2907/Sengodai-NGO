const ContactMessage = require('../models/ContactMessage');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const msg = await ContactMessage.create({ name, email, subject, message });

    // Send acknowledgment email to user (non-blocking)
    sendEmail({
      email,
      subject: `We received your message - Blood Connect`,
      message: `Hi ${name},\n\nThank you for contacting us. We have received your message and will get back to you shortly.\n\nYour message: "${message}"\n\nBest regards,\nBlood Connect Team`
    }).catch(err => console.error('Ack email failed:', err));

    // Notify admin
    sendEmail({
      email: process.env.ADMIN_EMAIL || 'admin@sengodai.org',
      subject: `New Contact Message: ${subject}`,
      message: `New message from ${name} (${email}):\n\n${message}`
    }).catch(err => console.error('Admin notification email failed:', err));

    res.status(201).json({ success: true, message: 'Message sent successfully', data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all messages
// @route   GET /api/contact
// @access  Private/Admin
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reply to a message
// @route   PUT /api/contact/:id/reply
// @access  Private/Admin
exports.replyMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

    await sendEmail({
      email: msg.email,
      subject: `Re: ${msg.subject} - Blood Connect`,
      message: `Hi ${msg.name},\n\n${req.body.reply}\n\nBest regards,\nBlood Connect Team`
    });

    msg.reply = req.body.reply;
    msg.status = 'Replied';
    msg.repliedAt = new Date();
    await msg.save();

    res.status(200).json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
exports.markRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id, { status: 'Read' }, { new: true }
    );
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
