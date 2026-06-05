import { NavLink, Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import {
  LayoutDashboard, Users, Droplet, Tent, FileText, MessageSquare,
  Settings, LogOut, Bell, Search, User, HeartHandshake, HeartPulse, UserCircle,
  ImageIcon, Menu, Check, CheckCheck, Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReactNode, useState, useEffect } from "react";
import { authStore, useAuth } from "@/store/auth";
import { LucideIcon } from "lucide-react";
import { useSocket, getSocket } from "@/hooks/useSocket";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const AppLayout = ({ children, title }: { children: ReactNode; title?: string }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();
  const user = auth.currentUser;
  const isAdmin = user?.role === "admin";

  const adminNav: NavItem[] = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/donors", label: t("nav.donors"), icon: Users },
    { to: "/blood-requests", label: t("nav.blood_requests"), icon: Droplet },
    { to: "/camps", label: t("nav.camps"), icon: Tent },
    { to: "/donations", label: "Donations", icon: HeartHandshake }, // TODO add to translations later
    { to: "/admin/users", label: t("nav.users"), icon: User },
    { to: "/admin/gallery", label: t("nav.gallery"), icon: ImageIcon },
    { to: "/admin/requests", label: "Manage Requests", icon: Droplet },
    { to: "/reports", label: t("nav.reports"), icon: FileText },
    { to: "/messages", label: t("nav.messages"), icon: MessageSquare, badge: 3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const volunteerNav: NavItem[] = [
    { to: "/volunteer-dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { to: "/request-blood", label: t("nav.request_blood"), icon: Droplet },
    { to: "/donate", label: "Donate Blood", icon: HeartPulse },
    { to: "/blood-requests", label: "My Requests", icon: FileText },
    { to: "/donations", label: "My Donations", icon: HeartHandshake },
    { to: "/messages", label: t("nav.messages"), icon: MessageSquare },
    { to: "/profile", label: t("nav.profile"), icon: UserCircle },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const nav = isAdmin ? adminNav : volunteerNav;
  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "??";
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const roleLabel = isAdmin ? "Admin" : "Volunteer";

  const handleLogout = () => {
    authStore.logout();
    navigate("/login");
  };

  // Notifications logic
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Play audio chime using Web Audio API (highly robust, no external MP3 dependencies)
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, time: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.start(time);
        osc.stop(time + duration);
      };
      const now = audioCtx.currentTime;
      playTone(523.25, now, 0.15); // C5
      playTone(659.25, now + 0.1, 0.25); // E5
    } catch (err) {
      console.error("Failed to play notification sound", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.data.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await api.put("/notifications/read-all");
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const socketInstance = getSocket();
    socketInstance.connect();

    const handleNewAlert = (data: any) => {
      playNotificationSound();
      
      const details = data.requestDetails;
      toast.error("🩸 NEW BLOOD REQUEST!", {
        description: `${details.patientName} needs ${details.units} units of ${details.bloodGroup} at ${details.hospitalName}. Contact: ${details.contactPhone}`,
        duration: 8000,
      });

      // Prepend to notifications state
      setNotifications((prev) => [data.notification, ...prev]);
      setUnreadCount((c) => c + 1);
    };

    socketInstance.on("new_blood_request_notification", handleNewAlert);

    return () => {
      socketInstance.off("new_blood_request_notification", handleNewAlert);
    };
  }, []);

  // Connect Socket.io for real-time notifications
  useSocket(user?.bloodGroup, user?.role, user?.id);

  return (
    <div className="min-h-screen flex bg-secondary/40">
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border sticky top-0 h-screen">
        <div className="px-6 py-5 border-b border-sidebar-border">
          <Logo />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/dashboard" || n.to === "/volunteer-dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`
              }
            >
              <n.icon className="h-4 w-4" />
              <span className="flex-1">{n.label}</span>
              {n.badge && <Badge className="bg-primary text-primary-foreground h-5 min-w-5 px-1.5">{n.badge}</Badge>}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 w-full"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center gap-4 px-4 lg:px-8 h-16">
            <div className="lg:hidden flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 flex flex-col">
                  <div className="px-6 py-5 border-b border-sidebar-border">
                    <Logo />
                  </div>
                  <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {nav.map((n) => (
                      <NavLink
                        key={n.to}
                        to={n.to}
                        end={n.to === "/dashboard" || n.to === "/volunteer-dashboard"}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                          }`
                        }
                      >
                        <n.icon className="h-4 w-4" />
                        <span className="flex-1">{n.label}</span>
                        {n.badge && <Badge className="bg-primary text-primary-foreground h-5 min-w-5 px-1.5">{n.badge}</Badge>}
                      </NavLink>
                    ))}
                  </nav>
                  <div className="p-3 border-t border-sidebar-border mt-auto">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 w-full"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
              <Logo />
            </div>
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search here..." className="pl-9 bg-secondary/60 border-0" />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <LanguageSwitcher />
              {isAdmin ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0 border border-border bg-background shadow-lg rounded-xl z-50 mr-4" align="end">
                    <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
                      <h4 className="font-bold text-sm">Notifications</h4>
                      {unreadCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs text-primary font-medium hover:bg-secondary px-2 rounded"
                          onClick={handleMarkAllAsRead}
                        >
                          <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
                        </Button>
                      )}
                    </div>
                    <ScrollArea className="h-80">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                          No notifications yet.
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {notifications.map((n) => (
                            <div 
                              key={n._id} 
                              className={`p-4 transition-colors text-left flex gap-3 relative ${
                                n.isRead ? "opacity-75 hover:bg-secondary/20" : "bg-primary-soft hover:bg-secondary/40"
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 justify-between">
                                  <span className="font-semibold text-xs text-foreground truncate">{n.title}</span>
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 leading-snug">{n.message}</p>
                              </div>
                              {!n.isRead && (
                                <button 
                                  onClick={() => handleMarkAsRead(n._id)}
                                  className="h-6 w-6 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center shrink-0 self-center transition-all"
                                  title="Mark as read"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              ) : (
                <Link to="/messages">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                  </Button>
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block leading-tight">
                  <div className="text-sm font-semibold">{displayName}</div>
                  <div className="text-xs text-muted-foreground">{roleLabel}</div>
                </div>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
};
