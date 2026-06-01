import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth, authStore } from "@/store/auth";
import { User, Lock, Bell, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const auth = useAuth();
  const user = auth.currentUser;
  const [activeTab, setActiveTab] = useState("profile");

  // Profile fields
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
  });

  // Password fields
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notifications
  const [notifs, setNotifs] = useState({
    email: true,
    sms: false,
    urgent: true,
    camps: true,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    publicSearch: true,
    shareHistory: false,
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    if (!user) return;
    if (!profileForm.firstName.trim() || !profileForm.phone.trim()) {
      toast({ title: "First name and phone are required", variant: "destructive" });
      return;
    }
    try {
      await authStore.updateUser(user.id, profileForm);
      toast({ title: "Profile settings saved" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
  };

  const handlePasswordSave = async () => {
    if (!user) return;
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    try {
      await authStore.updateUser(user.id, { password: passwordForm.newPassword });
      toast({ title: "Password updated successfully" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e: any) {
      toast({ title: "Password update failed", description: e.message, variant: "destructive" });
    }
  };

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
    toast({ title: "Preferences updated" });
  };

  const togglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    toast({ title: "Privacy settings updated" });
  };

  const menuItems = [
    { id: "profile", icon: User, title: "Profile Settings", desc: "Update your personal details" },
    { id: "security", icon: Lock, title: "Account Security", desc: "Change your password" },
    { id: "notifications", icon: Bell, title: "Notifications", desc: "Manage alert preferences" },
    { id: "privacy", icon: Shield, title: "Privacy & Data", desc: "Control visibility settings" },
  ];

  return (
    <AppLayout title="Settings">
      <p className="text-sm text-muted-foreground -mt-4 mb-6">Manage your account settings and preferences</p>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left p-4 rounded-xl border-0 transition-all flex items-center gap-3 ${
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-card hover:bg-secondary/40 text-foreground"
              }`}
            >
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${activeTab === item.id ? "bg-white/20 text-white" : "bg-primary-soft text-primary"}`}>
                <item.icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{item.title}</div>
                <div className={`text-xs truncate ${activeTab === item.id ? "text-white/80" : "text-muted-foreground"}`}>{item.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Pane */}
        <div className="md:col-span-2">
          <Card className="p-6 border-0 shadow-card">
            {activeTab === "profile" && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b border-border pb-2">Profile Settings</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name*</Label>
                    <Input value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Phone*</Label>
                  <Input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Location / Address</Label>
                  <Input value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} className="mt-1" />
                </div>
                <Button onClick={handleProfileSave} className="mt-2">Save Profile Settings</Button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b border-border pb-2">Account Security</h3>
                <div>
                  <Label>Current Password</Label>
                  <Input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="mt-1" placeholder="••••••••" />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="mt-1" placeholder="••••••••" />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="mt-1" placeholder="••••••••" />
                </div>
                <Button onClick={handlePasswordSave} className="mt-2">Update Password</Button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg border-b border-border pb-2">Notifications Preferences</h3>
                <div className="space-y-4">
                  {[
                    ["email", "Email Alerts", "Receive matched requests & newsletter via email"],
                    ["sms", "SMS Notifications", "Get urgent text notifications for critical matches"],
                    ["urgent", "Urgent Push Notifications", "Immediate browser warnings for critical status updates"],
                    ["camps", "Camp Reminders", "Notifications about upcoming local donation camps"],
                  ].map(([key, title, desc]) => (
                    <div key={key} className="flex items-center justify-between border-b border-border/40 pb-3">
                      <div>
                        <div className="font-bold text-sm">{title}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                      </div>
                      <Switch checked={notifs[key as keyof typeof notifs]} onCheckedChange={() => toggleNotif(key as keyof typeof notifs)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h3 className="font-bold text-lg border-b border-border pb-2">Privacy & Data</h3>
                <div className="space-y-4">
                  {[
                    ["publicSearch", "Public Visibility", "Allow other members to find you in the compatible donors search list"],
                    ["shareHistory", "Share History", "Make your donor campaign history public to friends"],
                  ].map(([key, title, desc]) => (
                    <div key={key} className="flex items-center justify-between border-b border-border/40 pb-3">
                      <div>
                        <div className="font-bold text-sm">{title}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                      </div>
                      <Switch checked={privacy[key as keyof typeof privacy]} onCheckedChange={() => togglePrivacy(key as keyof typeof privacy)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
