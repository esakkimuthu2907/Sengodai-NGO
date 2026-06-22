const api = "https://blood-connect-backend-ten.vercel.app/api/auth/register";

async function registerUser(user) {
  try {
    const res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
    const data = await res.json();
    console.log(`Registration for ${user.email}:`, data);
  } catch (err) {
    console.error(`Error for ${user.email}:`, err.message);
  }
}

async function main() {
  await registerUser({
    name: "Admin",
    email: "admin@sengodai.org",
    password: "admin123",
    role: "admin",
    adminSecret: "adminsignupsecretkey123",
    phone: "9999999999",
    location: "Tirunelveli"
  });

  await registerUser({
    name: "Esakki Kumar",
    firstName: "Esakki",
    lastName: "Kumar",
    email: "esakkimuthu2907@gmail.com",
    password: "Esakki123",
    role: "volunteer",
    phone: "9876500010",
    location: "Tirunelveli",
    bloodGroup: "O+"
  });
}

main();
