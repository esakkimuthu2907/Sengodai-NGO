import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, MapPin, Edit, Trash2, Plus } from "lucide-react";
import { campStore, useCamps, type Camp } from "@/store/camps";
import { useAuth } from "@/store/auth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const emptyCamp = {
  name: "", date: "", time: "", location: "", description: "",
  organizer: "Sengodai Blood Foundation", contactPhone: "", status: "upcoming" as Camp["status"],
};

const Camps = () => {
  const { t } = useTranslation();
  const camps = useCamps();
  const auth = useAuth();
  const isAdmin = auth.currentUser?.role === "admin";
  const [editCamp, setEditCamp] = useState<Camp | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCamp);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openNew = () => {
    setForm(emptyCamp);
    setIsNew(true);
    setEditCamp({} as Camp);
  };

  const openEdit = (c: Camp) => {
    setForm({
      name: c.name, date: c.date, time: c.time, location: c.location,
      description: c.description, organizer: c.organizer, contactPhone: c.contactPhone,
      status: c.status,
    });
    setIsNew(false);
    setEditCamp(c);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.date.trim() || !form.location.trim()) {
      toast({ title: "Please fill Name, Date, and Location", variant: "destructive" });
      return;
    }
    
    try {
      if (isNew) {
        await campStore.add(form);
        toast({ title: "Camp created successfully" });
      } else if (editCamp?.id) {
        campStore.update(editCamp.id, form);
        toast({ title: "Camp updated successfully" });
      }
      setEditCamp(null);
    } catch (e: any) {
      toast({ title: "Operation failed", description: e.response?.data?.message || "An error occurred", variant: "destructive" });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      campStore.remove(deleteId);
      toast({ title: "Camp deleted" });
      setDeleteId(null);
    }
  };

  return (
    <AppLayout title={t("camps.page_title")}>
      <p className="text-sm text-muted-foreground -mt-4 mb-6">{t("camps.subtitle")}</p>
      <Card className="p-6 border-0 shadow-card">
        <div className="flex justify-between items-center mb-6">
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">{t("camps.upcoming")}</TabsTrigger>
              <TabsTrigger value="past">{t("camps.past")}</TabsTrigger>
            </TabsList>
          </Tabs>
          {isAdmin && <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />{t("camps.organize")}</Button>}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {camps.length === 0 && (
            <div className="col-span-full text-center py-10 text-sm text-muted-foreground">{t("camps.no_camps")}</div>
          )}
          {camps.map((c) => (
            <Card key={c.id} className="overflow-hidden border-0 shadow-card">
              <div className="p-5">
                <h3 className="font-bold">{c.name}</h3>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{c.date}</div>
                  <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{c.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{c.location}</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link to={`/camps/${c.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-soft">{t("camps.view")}</Button>
                  </Link>
                  {isAdmin && (
                    <>
                      <Button size="icon" variant="outline" onClick={() => openEdit(c)}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="outline" className="text-destructive border-destructive" onClick={() => setDeleteId(c.id)}><Trash2 className="h-4 w-4" /></Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={!!editCamp} onOpenChange={(o) => !o && setEditCamp(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNew ? t("camps.new_camp_title") : t("camps.edit_camp_title")}</DialogTitle>
            <DialogDescription>{isNew ? t("camps.new_camp_desc") : t("camps.edit_camp_desc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>{t("camps.camp_name")}</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1" placeholder={t("camps.camp_name_ph")} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t("camps.date")}</Label><Input value={form.date} onChange={(e) => set("date", e.target.value)} className="mt-1" placeholder={t("camps.date_ph")} /></div>
              <div><Label>{t("camps.time")}</Label><Input value={form.time} onChange={(e) => set("time", e.target.value)} className="mt-1" placeholder={t("camps.time_ph")} /></div>
            </div>
            <div><Label>{t("camps.location")}</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} className="mt-1" placeholder={t("camps.location_ph")} /></div>
            <div><Label>{t("camps.organizer")}</Label><Input value={form.organizer} onChange={(e) => set("organizer", e.target.value)} className="mt-1" /></div>
            <div><Label>{t("camps.contact_phone")}</Label><Input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} className="mt-1" /></div>
            <div><Label>{t("camps.description")}</Label><Input value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1" placeholder={t("camps.desc_ph")} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCamp(null)}>{t("camps.cancel")}</Button>
            <Button onClick={handleSave}>{isNew ? t("camps.create") : t("camps.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("camps.delete_title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("camps.delete_desc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("camps.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">{t("camps.delete_btn")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Camps;
