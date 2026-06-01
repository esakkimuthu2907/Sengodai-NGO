import { NavLink, Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import {
  LayoutDashboard, Users, Droplet, Tent, FileText, MessageSquare,
  Settings, LogOut, Bell, Search, User, HeartHandshake
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/donors", label: "Donors", icon: Users },
  { to: "/blood-requests", label: "Blood Requests", icon: Droplet },
  { to: "/camps", label: "Camps", icon: Tent },
  { to: "/donations", label: "Donations", icon: HeartHandshake },
  { to: "/admin/users", label: "Users", icon: User },
  { to: "/admin/requests", label: "Manage Requests", icon: Droplet },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const AppLayout = ({ children, title }: { children: ReactNode; title?: string }) => {
  const navigate = useNavigate();
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
              end={n.to === "/dashboard"}
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
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 w-full"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center gap-4 px-4 lg:px-8 h-16">
            <div className="lg:hidden"><Logo /></div>
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search here..." className="pl-9 bg-secondary/60 border-0" />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                </Button>
              </Link>
              <Link to="/profile" className="flex items-center gap-2">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">RK</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block leading-tight">
                  <div className="text-sm font-semibold">Ramesh Kumar</div>
                  <div className="text-xs text-muted-foreground">Donor</div>
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
