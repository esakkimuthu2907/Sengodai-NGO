import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { donationStore } from "@/store/donations";
import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Donate = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();
  const user = auth.currentUser;

  const [form, setForm] = useState({
    date: "",
    location: "",
    campName: "",
    units: "1",
    notes: "",
  });

  const set = <K extends keyof typeof form>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.location) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    donationStore.add({
      donorId: user?.id || "",
      donorName: user ? `${user.firstName} ${user.lastName}` : "Unknown",
      campName: form.campName || "Direct Donation",
      date: form.date,
      location: form.location,
      bloodGroup: user?.bloodGroup || "Unknown",
      units: parseInt(form.units) || 1,
      status: "Scheduled",
    });
    toast({ title: "Donation Registered!", description: "Your donation has been scheduled successfully." });
    navigate("/donations");
  };

  return (
    <AppLayout title={t("donate.page_title")}>
      <p className="text-sm text-muted-foreground -mt-4 mb-6">{t("donate.subtitle")}</p>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-0 shadow-card space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>{t("donate.pref_date")}</Label>
              <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>{t("donate.units_donate")}</Label>
              <Select value={form.units} onValueChange={(v) => set("units", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["1", "2"].map((u) => <SelectItem key={u} value={u}>{u} Unit{u === "2" ? "s" : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>{t("donate.pref_location")}</Label>
            <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder={t("donate.pref_location_ph")} className="mt-1" />
          </div>
          <div>
            <Label>{t("donate.camp_name")}</Label>
            <Input value={form.campName} onChange={(e) => set("campName", e.target.value)} placeholder={t("donate.camp_name_ph")} className="mt-1" />
          </div>
          <div>
            <Label>{t("donate.notes")}</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t("donate.notes_ph")} className="mt-1" maxLength={300} />
          </div>
          <Button type="submit" className="w-full" size="lg">{t("donate.register")}</Button>
        </Card>

        <Card className="p-6 border-0 shadow-card bg-success/5 text-center h-fit">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-success text-success-foreground flex items-center justify-center mb-4">
            <HeartPulse className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-success text-lg">{t("donate.be_hero")}</h3>
          <p className="text-sm text-muted-foreground mt-2">{t("donate.hero_desc")}</p>
          <div className="mt-4 p-3 rounded-lg bg-background text-left text-xs text-muted-foreground space-y-1">
            <div><strong>{t("donate.your_bg")}</strong> {user?.bloodGroup || t("common.na")}</div>
            <div><strong>{t("donate.name")}</strong> {user?.firstName} {user?.lastName}</div>
            <div><strong>{t("donate.location")}</strong> {user?.district}, {user?.state}</div>
          </div>
        </Card>
      </form>
    </AppLayout>
  );
};

export default Donate;
