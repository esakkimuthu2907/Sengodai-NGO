import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Droplet, Building2, HeartHandshake, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useRequests } from "@/store/requests";
import { useAuth } from "@/store/auth";
import { useDonors } from "@/store/donors";
import { useCamps } from "@/store/camps";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const user = auth.currentUser;
  const requests = useRequests();
  const donors = useDonors();
  const camps = useCamps();

  const stats = [
    { icon: Users, value: donors.length.toLocaleString(), label: t("dashboard.total_donors"), trend: "+12.5%", color: "text-primary", bg: "bg-primary-soft" },
    { icon: Droplet, value: requests.filter((r) => r.status === "Pending" || r.status === "Approved").length.toLocaleString(), label: t("dashboard.active_requests"), trend: "+8.2%", color: "text-warning", bg: "bg-warning/10" },
    { icon: Building2, value: camps.length.toLocaleString(), label: t("dashboard.camps"), trend: "+5.1%", color: "text-primary", bg: "bg-primary-soft" },
    { icon: HeartHandshake, value: requests.filter((r) => r.status === "Fulfilled").length.toLocaleString(), label: t("dashboard.fulfilled"), trend: "+15.2%", color: "text-success", bg: "bg-success/10" },
  ];

  const summary = [
    { label: t("dashboard.high_priority"), value: requests.filter((r) => r.priority === "High").length, color: "bg-primary" },
    { label: t("dashboard.urgent"), value: requests.filter((r) => r.priority === "Urgent").length, color: "bg-destructive" },
    { label: t("dashboard.medium"), value: requests.filter((r) => r.priority === "Medium").length, color: "bg-warning" },
    { label: t("dashboard.low"), value: requests.filter((r) => r.priority === "Low").length, color: "bg-success" },
  ];

  return (
    <AppLayout>
      <div>
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("dashboard.welcome")} {user?.firstName} {user?.lastName}</p>
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
            <h3 className="font-bold text-lg">{t("dashboard.blood_requests_summary")}</h3>
            <Link to="/blood-requests" className="text-sm text-primary font-semibold">{t("dashboard.view_all")}</Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative h-44 w-44 shrink-0">
              <div className="absolute inset-0 rounded-full" style={{
                background: `conic-gradient(hsl(var(--primary)) 0 25%, hsl(var(--destructive)) 25% 55%, hsl(var(--warning)) 55% 80%, hsl(var(--success)) 80% 100%)`
              }} />
              <div className="absolute inset-6 rounded-full bg-background flex flex-col items-center justify-center">
                <div className="text-3xl font-extrabold">{requests.length}</div>
                <div className="text-xs text-muted-foreground">{t("dashboard.total")}</div>
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
          <h3 className="font-bold text-lg mb-4">{t("dashboard.quick_actions")}</h3>
          <div className="space-y-2">
            <Link to="/donors"><Button variant="outline" className="w-full justify-start"><Plus className="h-4 w-4 mr-2" />{t("dashboard.add_donor")}</Button></Link>
            <Link to="/request-blood"><Button variant="outline" className="w-full justify-start"><Droplet className="h-4 w-4 mr-2" />{t("dashboard.create_request")}</Button></Link>
            <Link to="/camps"><Button variant="outline" className="w-full justify-start"><Building2 className="h-4 w-4 mr-2" />{t("dashboard.organize_camp")}</Button></Link>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6 border-0 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{t("dashboard.recent_requests")}</h3>
          <Link to="/blood-requests" className="text-sm text-primary font-semibold">{t("dashboard.view_all")}</Link>
        </div>
        <div className="divide-y divide-border">
          {requests.slice(0, 5).map((r) => (
            <div key={r.id} className="flex items-center gap-4 py-3">
              <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{r.bloodGroup}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{r.units} {r.units > 1 ? t("dashboard.units") : t("dashboard.unit")}</div>
                <div className="text-xs text-muted-foreground">{r.hospital}</div>
              </div>
              <Badge className={r.priority === "Urgent" ? "bg-destructive" : r.priority === "High" ? "bg-primary" : r.priority === "Medium" ? "bg-warning" : "bg-success"}>{r.priority}</Badge>
              <Badge className={r.status === "Pending" ? "bg-warning" : r.status === "Approved" ? "bg-primary" : r.status === "Fulfilled" ? "bg-success" : "bg-destructive"}>{r.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
};

export default Dashboard;
