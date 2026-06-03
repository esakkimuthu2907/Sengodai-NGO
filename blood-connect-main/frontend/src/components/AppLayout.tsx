import { NavLink, Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import {
  LayoutDashboard, Users, Droplet, Tent, FileText, MessageSquare,
  Settings, LogOut, Bell, Search, User, HeartHandshake, HeartPulse, UserCircle,
  ImageIcon, Menu
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";
import { authStore, useAuth } from "@/store/auth";
import { LucideIcon } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                </Button>
              </Link>
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
