import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HeartHandshake, Edit, Trash2, Plus } from "lucide-react";
import { donationStore, useDonations, type Donation } from "@/store/donations";
import { useAuth } from "@/store/auth";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const statusColor: Record<string, string> = {
  Completed: "bg-success",
  Scheduled: "bg-primary",
  Cancelled: "bg-destructive",
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const emptyForm = {
  donorId: "", donorName: "", campName: "", date: "", location: "",
  bloodGroup: "", units: "1", status: "Scheduled" as Donation["status"],
};

const Donations = () => {
  const { t } = useTranslation();
  const donations = useDonations();
  const auth = useAuth();
  const isAdmin = auth.currentUser?.role === "admin";
  const [editDon, setEditDon] = useState<Donation | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openNew = () => {
    setForm(emptyForm);
    setIsNew(true);
    setEditDon({} as Donation);
  };

  const openEdit = (d: Donation) => {
    setForm({
      donorId: d.donorId, donorName: d.donorName, campName: d.campName,
      date: d.date, location: d.location, bloodGroup: d.bloodGroup,
      units: String(d.units), status: d.status,
    });
    setIsNew(false);
    setEditDon(d);
  };

  const handleSave = () => {
    if (!form.donorName.trim() || !form.date.trim()) {
      toast({ title: "Please fill Donor Name and Date", variant: "destructive" });
      return;
    }
    const data = { ...form, units: parseInt(form.units) || 1 };
    if (isNew) {
      donationStore.add(data);
      toast({ title: "Donation added" });
    } else if (editDon?.id) {
      donationStore.update(editDon.id, data);
      toast({ title: "Donation updated" });
    }
    setEditDon(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      donationStore.remove(deleteId);
      toast({ title: "Donation deleted" });
      setDeleteId(null);
    }
  };

  return (
    <AppLayout title={isAdmin ? t("donations.admin_title") : t("donations.my_title")}>
      <div className="flex items-center justify-between -mt-4 mb-6">
        <p className="text-sm text-muted-foreground">{isAdmin ? t("donations.admin_subtitle") : t("donations.my_subtitle")}</p>
        {isAdmin && <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-2" />{t("donations.add_btn")}</Button>}
      </div>
      <div className="space-y-3">
        {donations.length === 0 && (
          <Card className="p-8 border-0 shadow-card text-center text-muted-foreground">{t("donations.no_donations")}</Card>
        )}
        {donations.map((d) => (
          <Card key={d.id} className="p-5 border-0 shadow-card flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center">
              <HeartHandshake className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-bold">{d.campName}</div>
              <div className="text-xs text-muted-foreground">{d.date} · {d.location}</div>
              <div className="text-xs text-muted-foreground">{t("donations.donor_lbl")} {d.donorName} · {d.bloodGroup} · {d.units} unit(s)</div>
            </div>
            <Badge className={statusColor[d.status] || "bg-secondary"}>{d.status}</Badge>
            {isAdmin && (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(d)}><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(d.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={!!editDon} onOpenChange={(o) => !o && setEditDon(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNew ? t("donations.add_title") : t("donations.edit_title")}</DialogTitle>
            <DialogDescription>{isNew ? t("donations.add_desc") : t("donations.edit_desc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t("donations.donor_name")}</Label><Input value={form.donorName} onChange={(e) => set("donorName", e.target.value)} className="mt-1" /></div>
              <div><Label>{t("donations.blood_group")}</Label>
                <Select value={form.bloodGroup} onValueChange={(v) => set("bloodGroup", v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{bloodGroups.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>{t("donations.camp_event")}</Label><Input value={form.campName} onChange={(e) => set("campName", e.target.value)} className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t("donations.date")}</Label><Input value={form.date} onChange={(e) => set("date", e.target.value)} className="mt-1" placeholder={t("donations.date_ph")} /></div>
              <div><Label>{t("donations.location")}</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t("donations.units")}</Label><Input type="number" value={form.units} onChange={(e) => set("units", e.target.value)} className="mt-1" min={1} max={3} /></div>
              <div><Label>{t("donations.status")}</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v as Donation["status"])}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">{t("donations.scheduled")}</SelectItem>
                    <SelectItem value="Completed">{t("donations.completed")}</SelectItem>
                    <SelectItem value="Cancelled">{t("donations.cancelled")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDon(null)}>{t("donations.cancel")}</Button>
            <Button onClick={handleSave}>{isNew ? t("donations.add_done") : t("donations.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("donations.delete_title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("donations.delete_desc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("donations.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">{t("donations.delete_btn")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Donations;
