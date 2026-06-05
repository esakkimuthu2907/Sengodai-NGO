const twilio = require('twilio');

/**
 * Initialise and return a Twilio client.
 * Returns null if credentials are missing.
 */
function getTwilioClient() {
  const accountSid = (process.env.TWILIO_ACCOUNT_SID || '').trim();
  const authToken  = (process.env.TWILIO_AUTH_TOKEN  || '').trim();

  if (!accountSid || !authToken) {
    console.warn('[Twilio] Credentials missing – simulation mode.');
    return null;
  }

  return twilio(accountSid, authToken);
}

/**
 * Send an SMS or WhatsApp message via Twilio.
 *
 * @param {string}  to          Recipient in E.164 format, e.g. +917904577032
 * @param {string}  body        Message text
 * @param {boolean} isWhatsApp  true = WhatsApp, false = SMS
 */
async function sendTwilioMessage(to, body, isWhatsApp = false) {
  const client = getTwilioClient();

  /* ---- build FROM number ------------------------------------------------ */
  let from;
  if (isWhatsApp) {
    // WHATSAPP_FROM can be "whatsapp:+14155238886" OR "+14155238886"
    const raw = (process.env.WHATSAPP_FROM || '').trim();
    from = raw.startsWith('whatsapp:') ? raw : `whatsapp:${raw}`;
  } else {
    // SMS_FROM should be a plain E.164 number like +19842572134
    const raw = (process.env.SMS_FROM || '').trim();
    from = raw.startsWith('+') ? raw : `+${raw}`;
  }

  /* ---- build TO number -------------------------------------------------- */
  let target;
  if (isWhatsApp) {
    // Ensure whatsapp: prefix on the recipient too
    target = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  } else {
    target = to.startsWith('+') ? to : `+${to}`;
  }

  /* ---- simulation fallback ---------------------------------------------- */
  if (!client) {
    console.log(`[SIM] ${isWhatsApp ? 'WhatsApp' : 'SMS'} | FROM: ${from} | TO: ${target}`);
    console.log(`[SIM] Body: ${body}`);
    return;
  }

  /* ---- send via Twilio -------------------------------------------------- */
  try {
    const message = await client.messages.create({ body, from, to: target });
    console.log(`✅ Twilio ${isWhatsApp ? 'WhatsApp' : 'SMS'} sent | SID: ${message.sid} | TO: ${target}`);
  } catch (err) {
    console.error(`❌ Twilio ${isWhatsApp ? 'WhatsApp' : 'SMS'} send error:`, err.message);
    throw err;
  }
}

module.exports = { sendTwilioMessage };
