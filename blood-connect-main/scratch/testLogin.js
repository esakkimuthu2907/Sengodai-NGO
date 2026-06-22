const fetch = require('node-fetch');
(async () => {
  try {
    const res = await fetch('https://blood-connect-backend-e33thxstn-esakkimuthu-s-s-projects.vercel.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sengodai.org', password: 'admin123' })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
})();
