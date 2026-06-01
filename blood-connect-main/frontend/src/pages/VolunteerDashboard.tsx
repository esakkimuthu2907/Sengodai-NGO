import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Droplet, HeartPulse, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useRequests } from "@/store/requests";
import { useDonations } from "@/store/donations";
import { useTranslation } from "react-i18next";

const statusColor: Record<string, string> = {
  Pending: "bg-warning text-warning-foreground",
  Approved: "bg-primary text-primary-foreground",
  Rejected: "bg-destructive text-destructive-foreground",
  Fulfilled: "bg-success text-success-foreground",
  Completed: "bg-success text-success-foreground",
  Scheduled: "bg-primary text-primary-foreground",
};

const VolunteerDashboard = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const user = auth.currentUser;
  const requests = useRequests();
  const donations = useDonations();

  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "??";

  return (
    <AppLayout>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="p-6 border-0 shadow-card text-center">
          <Avatar className="h-20 w-20 mx-auto border-4 border-primary-soft">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="font-bold text-xl mt-4">{user?.firstName} {user?.lastName}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Badge className="bg-primary mt-2">{user?.bloodGroup || t("common.na")} {t("volunteer_dashboard.blood_group")}</Badge>
          <Badge variant="outline" className="border-success text-success mt-2 ml-2">● {t("volunteer_dashboard.available")}</Badge>
          <div className="mt-4 text-sm text-muted-foreground space-y-1 text-left">
            <div>📍 {user?.district}, {user?.state}</div>
            <div>📱 {user?.phone}</div>
          </div>
          <Link to="/profile">
            <Button variant="outline" className="w-full mt-4 border-primary text-primary">{t("volunteer_dashboard.view_profile")}</Button>
          </Link>
        </Card>

        <Card className="p-6 border-0 shadow-card bg-primary/5">
          <h3 className="font-bold text-lg">{t("volunteer_dashboard.approval_status")}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {user?.status === "Approved"
              ? t("volunteer_dashboard.approved_msg")
              : user?.status === "Rejected"
              ? t("volunteer_dashboard.rejected_msg")
              : t("volunteer_dashboard.pending_msg")}
          </p>
          <Link to="/profile" className="inline-block mt-4">
            <Button variant="outline">{t("volunteer_dashboard.open_profile")}</Button>
          </Link>
        </Card>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome */}
          <div>
            <h1 className="text-2xl font-bold">{t("volunteer_dashboard.welcome")} {user?.firstName}! 👋</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("volunteer_dashboard.today_prompt")}</p>
          </div>

          {/* Action Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/request-blood">
              <Card className="p-6 border-0 shadow-card hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Droplet className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg">{t("volunteer_dashboard.request_blood")}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t("volunteer_dashboard.request_blood_desc")}</p>
                <div className="flex items-center gap-1 text-primary font-semibold text-sm mt-3 group-hover:gap-2 transition-all">
                  {t("volunteer_dashboard.request_now")} <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </Link>
            <Link to="/donate">
              <Card className="p-6 border-0 shadow-card hover:shadow-lg transition-shadow cursor-pointer group bg-gradient-to-br from-success/5 to-success/10">
                <div className="h-14 w-14 rounded-2xl bg-success text-success-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HeartPulse className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg">{t("volunteer_dashboard.donate_blood")}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t("volunteer_dashboard.donate_blood_desc")}</p>
                <div className="flex items-center gap-1 text-success font-semibold text-sm mt-3 group-hover:gap-2 transition-all">
                  {t("volunteer_dashboard.donate_now")} <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </Link>
          </div>

          {/* My Recent Requests */}
          <Card className="p-6 border-0 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{t("volunteer_dashboard.my_requests")}</h3>
              <Link to="/blood-requests" className="text-sm text-primary font-semibold">{t("dashboard.view_all")}</Link>
            </div>
            {requests.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">{t("volunteer_dashboard.no_requests")}</p>
            ) : (
              <div className="divide-y divide-border">
                {requests.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center gap-4 py-3">
                    <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{r.bloodGroup}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{r.units} Unit(s) · {r.patient}</div>
                      <div className="text-xs text-muted-foreground">{r.hospital}</div>
                    </div>
                    <Badge className={statusColor[r.status] || "bg-secondary"}>{r.status}</Badge>
                    <div className="text-xs text-muted-foreground hidden sm:block"><Clock className="h-3 w-3 inline mr-1" />{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* My Recent Donations */}
          <Card className="p-6 border-0 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{t("volunteer_dashboard.my_donations")}</h3>
              <Link to="/donations" className="text-sm text-primary font-semibold">{t("dashboard.view_all")}</Link>
            </div>
            {donations.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">{t("volunteer_dashboard.no_donations")}</p>
            ) : (
              <div className="divide-y divide-border">
                {donations.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center gap-4 py-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
                      <HeartPulse className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{d.campName}</div>
                      <div className="text-xs text-muted-foreground">{d.date} · {d.location}</div>
                    </div>
                    <Badge className={statusColor[d.status] || "bg-secondary"}>{d.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default VolunteerDashboard;
