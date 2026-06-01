import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Donors from "./pages/Donors.tsx";
import DonorDetails from "./pages/DonorDetails.tsx";
import RequestBlood from "./pages/RequestBlood.tsx";
import BloodRequests from "./pages/BloodRequests.tsx";
import Camps from "./pages/Camps.tsx";
import CampDetails from "./pages/CampDetails.tsx";
import Profile from "./pages/Profile.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import AdminRequests from "./pages/AdminRequests.tsx";
import Messages from "./pages/Messages.tsx";
import Reports from "./pages/Reports.tsx";
import Settings from "./pages/Settings.tsx";
import Donations from "./pages/Donations.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/donors/:id" element={<DonorDetails />} />
          <Route path="/request-blood" element={<RequestBlood />} />
          <Route path="/blood-requests" element={<BloodRequests />} />
          <Route path="/camps" element={<Camps />} />
          <Route path="/camps/:id" element={<CampDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
