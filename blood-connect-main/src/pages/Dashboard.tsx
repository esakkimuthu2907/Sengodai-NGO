import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Droplet, Building2, HeartHandshake, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { bloodRequests } from "@/data/mock";

const stats = [
  { icon: Users, value: "12,540", label: "Total Donors", trend: "+12.5%", color: "text-primary", bg: "bg-primary-soft" },
  { icon: Droplet, value: "1,230", label: "Active Requests", trend: "+8.2%", color: "text-warning", bg: "bg-warning/10" },
  { icon: Building2, value: "320", label: "Camps Conducted", trend: "+5.1%", color: "text-primary", bg: "bg-primary-soft" },
  { icon: HeartHandshake, value: "25,870", label: "Lives Saved", trend: "+15.2%", color: "text-success", bg: "bg-success/10" },
];

const summary = [
  { label: "High Priority", value: "25%", color: "bg-primary" },
  { label: "Urgent", value: "30%", color: "bg-destructive" },
  { label: "Medium", value: "25%", color: "bg-warning" },
  { label: "Low", value: "20%", color: "bg-success" },
];

const Dashboard = () => (
  <AppLayout>
    <div>
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <p className="text-sm text-muted-foreground">Welcome back, Ramesh Kumar</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {stats.map((s) => (
        <Card key={s.label} className="p-5 border-0 shadow-card">
          <div className="flex items-start justify-between">
            <div className={`h-12 w-12 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
            <Badge variant="secondary" className="text-success text-xs"><TrendingUp className="h-3 w-3 mr-1" />{s.trend}</Badge>
          </div>
          <div className="mt-4 text-3xl font-extrabold">{s.value}</div>
          <div className="text-sm text-muted-foreground">{s.label}</div>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-3 gap-4 mt-6">
      <Card className="lg:col-span-2 p-6 border-0 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Blood Requests Summary</h3>
          <Link to="/blood-requests" className="text-sm text-primary font-semibold">View All</Link>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative h-44 w-44 shrink-0">
            <div className="absolute inset-0 rounded-full" style={{
              background: `conic-gradient(hsl(var(--primary)) 0 25%, hsl(var(--destructive)) 25% 55%, hsl(var(--warning)) 55% 80%, hsl(var(--success)) 80% 100%)`
            }} />
            <div className="absolute inset-6 rounded-full bg-background flex flex-col items-center justify-center">
              <div className="text-3xl font-extrabold">1,230</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {summary.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${s.color}`} />
                <span className="flex-1 text-sm">{s.label}</span>
                <span className="font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-card">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Link to="/donors"><Button variant="outline" className="w-full justify-start"><Plus className="h-4 w-4 mr-2" />Add New Donor</Button></Link>
          <Link to="/request-blood"><Button variant="outline" className="w-full justify-start"><Droplet className="h-4 w-4 mr-2" />Create Blood Request</Button></Link>
          <Link to="/camps"><Button variant="outline" className="w-full justify-start"><Building2 className="h-4 w-4 mr-2" />Organize Camp</Button></Link>
        </div>
      </Card>
    </div>

    <Card className="mt-6 p-6 border-0 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Recent Blood Requests</h3>
        <Link to="/blood-requests" className="text-sm text-primary font-semibold">View All</Link>
      </div>
      <div className="divide-y divide-border">
        {bloodRequests.map((r) => (
          <div key={r.id} className="flex items-center gap-4 py-3">
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{r.bloodGroup}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{r.units} Unit{r.units > 1 ? "s" : ""}</div>
              <div className="text-xs text-muted-foreground">{r.hospital}</div>
            </div>
            <Badge className={r.priority === "Urgent" ? "bg-destructive" : r.priority === "High" ? "bg-primary" : r.priority === "Medium" ? "bg-warning" : "bg-success"}>{r.priority}</Badge>
            <span className="text-xs text-muted-foreground hidden md:block">{r.time}</span>
          </div>
        ))}
      </div>
    </Card>
  </AppLayout>
);

export default Dashboard;
