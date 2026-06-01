import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Phone, Mail, MapPin, Calendar, Edit2 } from "lucide-react";
import { useAuth, authStore } from "@/store/auth";
import { useDonations } from "@/store/donations";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { states, districts, places, bloodGroups } from "../data/tamilnadu";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const user = auth.currentUser;
  const donations = useDonations();
  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "??";
  const volunteerId = user?.id ? `SD-${user.id.slice(-6).toUpperCase()}` : "SD-000000";
  const isAdmin = user?.role === "admin";
  const isApproved = isAdmin || user?.status === "Approved";
  const approvalLabel = isAdmin ? "Approved" : user?.status || "Pending";
  const myDonations = donations.filter((d) => d.donorId === user?.id);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bloodGroup: "",
    location: "",
    district: "",
    state: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        bloodGroup: user.bloodGroup || "O+",
        location: user.location || "",
        district: user.district || "",
        state: user.state || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const toggleAvailability = () => {
    if (user) {
      authStore.updateUser(user.id, { available: !user.available });
      toast({ title: "Availability updated" });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.firstName.trim() || !form.phone.trim()) {
      toast({ title: "First name and Phone are required", variant: "destructive" });
      return;
    }
    try {
      const updatedData = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        bloodGroup: form.bloodGroup,
        location: form.location || `${form.district || ""}, ${form.state || ""}`.trim() || "Unknown",
        district: form.district,
        state: form.state,
        address: form.address,
      };
      await authStore.updateUser(user.id, updatedData);
      toast({ title: "Profile updated successfully" });
      setIsEditing(false);
    } catch (err: any) {
      toast({ title: "Failed to update profile", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AppLayout title={t("profile.page_title")}>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 border-0 shadow-card text-center relative overflow-hidden">
          <Avatar className="h-24 w-24 mx-auto border-4 border-primary-soft">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="font-bold text-xl mt-4">{user?.firstName} {user?.lastName}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Badge className="bg-primary mt-2">{user?.bloodGroup || t("common.na")} {t("profile.blood_group")}</Badge>
          <div className="mt-6 space-y-2 text-left text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{user?.phone}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{user?.email}</div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {user?.location || `${user?.district || ""}, ${user?.state || ""}`}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Badge variant="outline" className={`mx-auto ${user?.available ? "border-success text-success" : "border-muted-foreground text-muted-foreground"}`}>
            {user?.available ? t("profile.available") : t("profile.not_available")}
            </Badge>
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-2" />{t("profile.edit_profile")}
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-0 shadow-card">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">{t("profile.personal_info")}</TabsTrigger>
                <TabsTrigger value="history">{t("profile.donation_history")}</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-6">
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  {[
                    [t("profile.blood_group"), user?.bloodGroup || t("common.na")],
                    [t("profile.district"), user?.district || t("common.na")],
                    [t("profile.state"), user?.state || t("common.na")],
                    [t("profile.address"), user?.address || user?.location || t("common.na")],
                    [t("profile.phone"), user?.phone || t("common.na")],
                    [t("profile.email"), user?.email || t("common.na")],
                    [t("profile.approval"), approvalLabel],
                    [t("profile.role"), user?.role === "admin" ? t("profile.admin_role") : t("profile.volunteer_role")],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-6 space-y-3">
                {myDonations.length === 0 && <p className="text-sm text-muted-foreground">{t("profile.no_donations")}</p>}
                {myDonations.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <div className="font-semibold">{d.campName}</div>
                      <div className="text-xs text-muted-foreground">{d.date} · {d.location}</div>
                    </div>
                    <Badge className={d.status === "Completed" ? "bg-success" : d.status === "Scheduled" ? "bg-primary" : "bg-destructive"}>
                      {d.status}
                    </Badge>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5 border-0 shadow-card">
              <h3 className="font-bold mb-3">{t("profile.availability")}</h3>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={user?.available ? "border-success text-success" : "border-muted-foreground text-muted-foreground"}>
                  {user?.available ? t("profile.available") : t("profile.not_available")}
                </Badge>
                <Switch checked={user?.available ?? true} onCheckedChange={toggleAvailability} />
              </div>
            </Card>
            <Card className="p-5 border-0 shadow-card">
              <h3 className="font-bold mb-2">{t("profile.account")}</h3>
              <div className="flex items-center gap-2 text-primary"><Calendar className="h-4 w-4" /><span className="text-sm">{t("profile.member_since")} {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t("common.na")}</span></div>
              <p className="text-xs text-muted-foreground mt-1">{t("profile.role")}: {user?.role === "admin" ? t("profile.admin_role") : t("profile.volunteer_role")}</p>
            </Card>
          </div>
        </div>
      </div>

      {isApproved ? (
        <div className="lg:col-span-3 grid gap-4">
          <Card className="p-6 border-0 shadow-card bg-gradient-to-br from-primary/10 to-slate-50">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              <div className="flex-1 text-sm space-y-3">
                <div className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-semibold">{t("profile.volunteer_id_card")}</div>
                <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-sm text-muted-foreground max-w-xl">{t("profile.id_card_desc")}</p>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                  <div><span className="font-semibold">{t("profile.volunteer_id")}</span> {volunteerId}</div>
                  <div><span className="font-semibold">{t("profile.blood_group")}:</span> {user?.bloodGroup || t("common.na")}</div>
                  <div><span className="font-semibold">{t("profile.phone")}:</span> {user?.phone || t("common.na")}</div>
                  <div><span className="font-semibold">{t("profile.address")}:</span> {user?.location || t("common.na")}</div>
                </div>
              </div>
              <div className="min-w-[260px] rounded-3xl border border-primary/20 bg-white p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-primary font-semibold">Sengodai</div>
                    <div className="text-sm text-muted-foreground">Volunteer Card</div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">SD</div>
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">{t("profile.name_lbl")}</div>
                  <div className="text-lg font-semibold">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-muted-foreground">{t("profile.role_lbl")}</div>
                  <div className="text-sm font-medium">{t("profile.volunteer_role")}</div>
                  <div className="text-xs text-muted-foreground">{t("profile.member_since_lbl")}</div>
                  <div className="text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div className="mt-5 rounded-2xl bg-primary/5 p-3 text-[11px] uppercase tracking-[0.2em] font-semibold text-primary">{t("profile.approved")}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-card bg-gradient-to-br from-success/10 to-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-semibold">{t("profile.cert_title")}</div>
                <h2 className="mt-2 text-2xl font-bold">{t("profile.cert_h2")}</h2>
                <p className="mt-3 text-sm text-muted-foreground max-w-xl">{t("profile.cert_desc")}</p>
              </div>
              <img src="/sengodai-logo.png" alt="Sengodai logo" className="h-20 w-20 object-contain rounded-full bg-white p-3" />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">{t("profile.recipient")}</div>
                <div className="mt-2 text-lg font-semibold">{user?.firstName} {user?.lastName}</div>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="text-xs text-muted-foreground">{t("profile.date")}</div>
                <div className="mt-2 text-lg font-semibold">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground">{t("profile.cert_id")}</div>
                <div className="text-sm font-semibold">{volunteerId}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{t("profile.authorized")}</div>
                <div className="mt-2 text-sm font-semibold">Sengodai Blood Foundation</div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="lg:col-span-3 p-6 border-0 shadow-card bg-warning/10">
          <div className="space-y-3">
            <div className="inline-flex rounded-full bg-warning/10 px-3 py-1 text-sm font-semibold text-warning">{t("profile.pending_label")}</div>
            <h3 className="text-xl font-bold">{t("profile.pending_h3")}</h3>
            <p className="text-sm text-muted-foreground">{t("profile.pending_desc")}</p>
          </div>
        </Card>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("profile.edit_dialog_title")}</DialogTitle>
            <DialogDescription>{t("profile.edit_dialog_desc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t("profile.first_name")}</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>{t("profile.last_name")}</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>{t("profile.phone_label")}</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>{t("profile.blood_group_label")}</Label>
              <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{bloodGroups.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t("profile.state_label")}</Label>
                <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v, district: "" })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={t("profile.select_state")} /></SelectTrigger>
                  <SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("profile.district_label")}</Label>
                <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })} disabled={!form.state}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={t("profile.select_district")} /></SelectTrigger>
                  <SelectContent>{(districts[form.state] || []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{t("profile.address_label")}</Label>
              <Input value={form.address || form.location} onChange={(e) => setForm({ ...form, address: e.target.value, location: e.target.value })} className="mt-1" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>{t("profile.cancel")}</Button>
            <Button onClick={handleSave}>{t("profile.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Profile;
