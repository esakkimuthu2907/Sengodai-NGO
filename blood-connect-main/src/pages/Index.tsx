import { PublicHeader, PublicFooter } from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, Droplet, HeartPulse, Building2, Calendar, MapPin, Clock } from "lucide-react";
import hero from "@/assets/hero-blood.png";
import camp1 from "@/assets/camp-1.jpg";
import { camps, bloodRequests } from "@/data/mock";

const stats = [
  { icon: Users, value: "12,540+", label: "Total Donors" },
  { icon: Droplet, value: "25,870+", label: "Lives Saved" },
  { icon: HeartPulse, value: "1,230+", label: "Active Requests" },
  { icon: Building2, value: "320+", label: "Camps Conducted" },
];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-soft" />
          <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
            <div>
              <Badge className="bg-primary-soft text-primary border-0 mb-6 px-3 py-1">
                ❤️ Save Lives Today
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                Donate Blood,<br />
                <span className="text-gradient">Save Lives</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-md">
                Your one donation can bring hope, strength and life to someone in need.
                Join the Sengodai community and be a hero.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/donors"><Button size="lg" className="px-8 shadow-glow">Find Donor</Button></Link>
                <Link to="/signup"><Button size="lg" variant="outline" className="px-8 border-primary text-primary hover:bg-primary-soft">Become Donor</Button></Link>
              </div>
            </div>
            <div className="relative">
              <img src={hero} alt="Blood donation hero" width={1024} height={1024} className="w-full max-w-lg mx-auto animate-float" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="container -mt-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="p-5 flex items-center gap-4 shadow-card border-0">
                <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Urgent + Upcoming */}
        <section className="container py-16 grid lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-card border-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary-soft flex items-center justify-center">
                  <Droplet className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold">Urgent Blood Requests</h3>
              </div>
              <Link to="/blood-requests" className="text-sm text-primary font-semibold">View All</Link>
            </div>
            {bloodRequests.slice(0, 2).map((r) => (
              <div key={r.id} className="flex items-center gap-4 py-3 border-t border-border">
                <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">{r.bloodGroup}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{r.units} Units</div>
                  <div className="text-xs text-muted-foreground">{r.hospital}</div>
                  <Badge className="mt-1 bg-primary text-primary-foreground text-[10px]">{r.priority}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">{r.time}</div>
                  <Button size="sm">View</Button>
                </div>
              </div>
            ))}
          </Card>

          <Card className="p-6 shadow-card border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Upcoming Blood Donation Camps</h3>
              <Link to="/camps" className="text-sm text-primary font-semibold">View All</Link>
            </div>
            {camps.slice(0, 2).map((c) => (
              <div key={c.id} className="flex gap-4 py-3 border-t border-border">
                <img src={camp1} alt={c.name} loading="lazy" width={120} height={80} className="h-20 w-28 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Calendar className="h-3 w-3" />{c.date}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{c.time}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{c.location}</div>
                </div>
              </div>
            ))}
          </Card>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
};

export default Landing;
