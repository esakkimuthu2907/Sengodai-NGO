import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/donors", label: "Donors" },
  { to: "/camps", label: "Camps" },
  { to: "/request-blood", label: "Request Blood" },
  { to: "/contact", label: "Contact" },
];

export const PublicHeader = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-foreground/70 hover:text-primary"
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Link to="/login">
            <Button size="sm">Login</Button>
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`text-sm font-semibold ${pathname === l.to ? "text-primary" : ""}`}>
                {l.label}
              </Link>
            ))}
            <Link to="/login"><Button className="w-full">Login</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
};

export const PublicFooter = () => (
  <footer className="border-t border-border mt-20 bg-secondary/40">
    <div className="container py-12 grid md:grid-cols-4 gap-8">
      <div>
        <Logo />
        <p className="mt-4 text-sm text-muted-foreground">
          Connecting donors with those in need. Every drop counts.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/donors" className="hover:text-primary">Find Donors</Link></li>
          <li><Link to="/request-blood" className="hover:text-primary">Request Blood</Link></li>
          <li><Link to="/camps" className="hover:text-primary">Camps</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-3">Account</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/login" className="hover:text-primary">Login</Link></li>
          <li><Link to="/signup" className="hover:text-primary">Become a Donor</Link></li>
          <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-3">Contact</h4>
        <p className="text-sm text-muted-foreground">Tirunelveli, Tamil Nadu<br/>+91 98765 43210<br/>hello@sengodai.org</p>
      </div>
    </div>
    <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
      © 2026 Sengodai Blood Foundation. All rights reserved.
    </div>
  </footer>
);
