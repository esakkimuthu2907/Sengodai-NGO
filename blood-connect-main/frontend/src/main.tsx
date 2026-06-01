import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";


// Clear stale mock-seeded localStorage data on app start
const CACHE_VERSION = "v2";
if (localStorage.getItem("cache_version") !== CACHE_VERSION) {
  ["sengodai_camps_v1", "sengodai_donors_v1", "sengodai_blood_requests_v1"].forEach(k => localStorage.removeItem(k));
  localStorage.setItem("cache_version", CACHE_VERSION);
}

createRoot(document.getElementById("root")!).render(<App />);
