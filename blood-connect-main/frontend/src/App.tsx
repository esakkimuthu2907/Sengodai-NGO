import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SplashScreen } from "./components/SplashScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useState, useCallback, useEffect } from "react";
import { authStore } from "./store/auth";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Forgot from "./pages/Forgot.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import VolunteerDashboard from "./pages/VolunteerDashboard.tsx";
import Donors from "./pages/Donors.tsx";
import DonorDetails from "./pages/DonorDetails.tsx";
import RequestBlood from "./pages/RequestBlood.tsx";
import BloodRequests from "./pages/BloodRequests.tsx";
import Camps from "./pages/Camps.tsx";
import CampDetails from "./pages/CampDetails.tsx";
import Profile from "./pages/Profile.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import AdminGallery from "./pages/AdminGallery.tsx";
import AdminRequests from "./pages/AdminRequests.tsx";
import Messages from "./pages/Messages.tsx";
import Reports from "./pages/Reports.tsx";
import Settings from "./pages/Settings.tsx";
import Donations from "./pages/Donations.tsx";
import Donate from "./pages/Donate.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      authStore.refreshCurrentUser();
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <BrowserRouter>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Admin-only pages */}
            <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute adminOnly><AdminGallery /></ProtectedRoute>} />
            <Route path="/admin/requests" element={<ProtectedRoute adminOnly><AdminRequests /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />
            {/* Shared protected pages (both admin and volunteer) */}
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

            {/* Volunteer-only pages */}
            <Route path="/volunteer-dashboard" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
            <Route path="/donate" element={<ProtectedRoute><Donate /></ProtectedRoute>} />

            {/* Shared protected pages (both admin and volunteer) */}
            <Route path="/donors" element={<ProtectedRoute><Donors /></ProtectedRoute>} />
            <Route path="/donors/:id" element={<ProtectedRoute><DonorDetails /></ProtectedRoute>} />
            <Route path="/request-blood" element={<ProtectedRoute><RequestBlood /></ProtectedRoute>} />
            <Route path="/blood-requests" element={<ProtectedRoute><BloodRequests /></ProtectedRoute>} />
            <Route path="/camps" element={<ProtectedRoute><Camps /></ProtectedRoute>} />
            <Route path="/camps/:id" element={<ProtectedRoute><CampDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
