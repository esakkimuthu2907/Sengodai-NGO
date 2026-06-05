require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
(async () => {
  try {
    // 1. Login as admin to obtain JWT token
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
    });
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status}`);
    }
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('🔐 Login token:', token);

    // 2. Create a blood request (will trigger Twilio alerts)
    const reqRes = await fetch('http://localhost:5000/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        patientName: 'Test Patient',
        bloodGroup: 'A+',
        units: 2,
        urgency: 'Critical',
        hospitalName: 'Test Hospital',
        location: 'Test City',
        contactName: 'Tester',
        contactPhone: '+919876543210',
        status: 'Pending'
      })
    });
    const reqData = await reqRes.json();
    console.log('📄 Request creation response:', reqData);
  } catch (err) {
    console.error('❌ Error during test:', err);
  }
})();
