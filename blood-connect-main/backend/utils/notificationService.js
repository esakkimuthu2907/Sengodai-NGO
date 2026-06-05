const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendTwilioMessage } = require('./twilioClient');

// Hardcoded admin phone – always +917904577032 as required
const ADMIN_PHONE = '+917904577032';

/**
 * Send SMS notification to the Admin.
 */
async function sendSMSAlert(request) {
  const message =
`NEW BLOOD REQUEST - BloodConnect
Blood Group: ${request.bloodGroup}
Patient: ${request.patientName}
Hospital: ${request.hospitalName}
Location: ${request.location || 'Not Specified'}
Contact: ${request.contactPhone}
Urgency: ${request.urgency || 'High'}
Request ID: #${request._id.toString().slice(-6)}
Please act immediately!`;

  console.log(`📱 Sending SMS to ${ADMIN_PHONE}...`);
  await sendTwilioMessage(ADMIN_PHONE, message, false);
}

/**
 * Send WhatsApp notification to the Admin.
 */
async function sendWhatsAppAlert(request) {
  const date = new Date(request.createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata'
  });

  const message =
`🩸 *NEW BLOOD REQUEST ALERT* 🩸

*Patient Name* : ${request.patientName}
*Blood Group*  : ${request.bloodGroup}
*Units Needed* : ${request.units}
*Urgency*      : 🚨 ${request.urgency || 'High'}
*Hospital*     : ${request.hospitalName}
*Location*     : ${request.location || 'Not Specified'}
*Contact No*   : ${request.contactPhone}
*Requested At* : ${date}

*Request ID*   : #${request._id.toString().slice(-6)}

Please respond immediately on BloodConnect! 🏥`;

  console.log(`📲 Sending WhatsApp to ${ADMIN_PHONE}...`);
  await sendTwilioMessage(ADMIN_PHONE, message, true);
}

/**
 * Orchestrates and triggers all alerts when a new blood request is created.
 */
async function sendBloodRequestAlerts(request, app) {
  try {
    console.log('🔔 Dispatching blood request alerts...');

    // 1. Send WhatsApp Alert to admin
    await sendWhatsAppAlert(request);

    // 2. Send SMS Alert to admin
    await sendSMSAlert(request);

    console.log('✅ WhatsApp + SMS alerts dispatched to', ADMIN_PHONE);

    // 3. Save Notification in the Database
    const admin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });

    const notification = await Notification.create({
      recipient: admin ? admin._id : null,
      recipientRole: 'admin',
      type: 'admin_alert',
      title: '🩸 New Blood Request Alert',
      message: `New request for ${request.bloodGroup} blood by ${request.patientName} at ${request.hospitalName}.`,
      relatedRequest: request._id,
      isRead: false
    });

    // 4. Emit Socket.io Event to Admin Dashboard
    const io = app ? app.get('io') : null;
    if (io) {
      io.to('admin_alerts').emit('new_blood_request_notification', {
        notification,
        requestDetails: {
          id: request._id,
          patientName: request.patientName,
          bloodGroup: request.bloodGroup,
          units: request.units,
          location: request.location,
          hospitalName: request.hospitalName,
          contactPhone: request.contactPhone,
          createdAt: request.createdAt
        }
      });
      console.log('🔌 Socket.io alert emitted to admin_alerts room');
    }
  } catch (error) {
    console.error('❌ Error dispatching blood request alerts:', error.message);
  }
}

module.exports = { sendBloodRequestAlerts };
