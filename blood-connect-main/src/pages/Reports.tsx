import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, Droplet, Building2, Heart } from "lucide-react";

const stats = [
  { icon: Heart, label: "Total Donations", value: "5,870", trend: "+11.2%" },
  { icon: Droplet, label: "New Donors", value: "2,450", trend: "+9.4%" },
  { icon: Building2, label: "Total Camps", value: "78", trend: "+4.5%" },
  { icon: TrendingUp, label: "Lives Impacted", value: "15,230", trend: "+18.6%" },
];

const Reports = () => (
  <AppLayout title="Reports & Analytics">
    <p className="text-sm text-muted-foreground -mt-4 mb-6">Track and analyze blood donation activities</p>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="p-5 border-0 shadow-card">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-primary-soft flex items-center justify-center">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs text-success font-semibold">{s.trend}</span>
          </div>
          <div className="text-2xl font-extrabold mt-3">{s.value}</div>
          <div className="text-xs text-muted-foreground">{s.label}</div>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-4 mt-6">
      <Card className="p-6 border-0 shadow-card">
        <h3 className="font-bold mb-4">Donations Over Time</h3>
        <svg viewBox="0 0 400 200" className="w-full h-48">
          <path d="M0,150 C50,140 100,100 150,110 C200,120 250,60 300,70 C350,80 400,40 400,40" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
          <path d="M0,150 C50,140 100,100 150,110 C200,120 250,60 300,70 C350,80 400,40 400,40 L400,200 L0,200 Z" fill="hsl(var(--primary) / 0.1)" />
        </svg>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => <span key={m}>{m}</span>)}
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-card">
        <h3 className="font-bold mb-4">Donors by Blood Group</h3>
        <div className="flex items-center gap-6">
          <div className="relative h-40 w-40">
            <div className="absolute inset-0 rounded-full" style={{
              background: `conic-gradient(hsl(var(--primary)) 0 35%, hsl(354 60% 70%) 35% 60%, hsl(354 40% 80%) 60% 80%, hsl(354 30% 90%) 80% 100%)`
            }} />
            <div className="absolute inset-6 rounded-full bg-background flex flex-col items-center justify-center">
              <div className="text-2xl font-extrabold">5,870</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
          <div className="space-y-2 text-sm flex-1">
            {[["O+","35%"],["A+","25%"],["B+","20%"],["AB+","10%"],["Others","10%"]].map(([k,v]) => (
              <div key={k} className="flex justify-between"><span>{k}</span><span className="font-bold">{v}</span></div>
            ))}
          </div>
        </div>
      </Card>
    </div>

    <Card className="p-6 border-0 shadow-card mt-6">
      <h3 className="font-bold mb-4">Top Performing Donors</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {["Ramesh Kumar","Priya Sharma","Karthik N","Vikram S"].map((n, i) => (
          <div key={n} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
            <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{n.split(" ").map(x=>x[0]).join("")}</AvatarFallback></Avatar>
            <div>
              <div className="text-sm font-semibold">{n}</div>
              <div className="text-xs text-muted-foreground">{12 - i} Donations</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </AppLayout>
);

export default Reports;
