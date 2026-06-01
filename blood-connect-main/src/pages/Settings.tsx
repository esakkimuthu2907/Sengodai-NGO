import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { ChevronRight, User, Lock, Bell, Shield, Globe } from "lucide-react";

const items = [
  { icon: User, title: "Profile Settings", desc: "Update your personal information" },
  { icon: Lock, title: "Account Settings", desc: "Change your password and security" },
  { icon: Bell, title: "Notification Settings", desc: "Manage your notification preferences" },
  { icon: Shield, title: "Privacy Settings", desc: "Control your privacy and data" },
  { icon: Globe, title: "Language Settings", desc: "Choose your preferred language" },
];

const Settings = () => (
  <AppLayout title="Settings">
    <p className="text-sm text-muted-foreground -mt-4 mb-6">Manage your account settings and preferences</p>
    <div className="space-y-3 max-w-3xl">
      {items.map((it) => (
        <Card key={it.title} className="p-5 border-0 shadow-card flex items-center gap-4 hover:shadow-soft cursor-pointer transition-shadow">
          <div className="h-11 w-11 rounded-xl bg-primary-soft flex items-center justify-center">
            <it.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-bold">{it.title}</div>
            <div className="text-sm text-muted-foreground">{it.desc}</div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Card>
      ))}
    </div>
  </AppLayout>
);

export default Settings;
