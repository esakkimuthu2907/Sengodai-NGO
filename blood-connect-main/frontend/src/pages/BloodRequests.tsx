import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, ChevronDown, ChevronUp, Clock, Edit, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { requestStore, useRequests, type BloodRequest, type RequestStatus } from "@/store/requests";
import { useAuth } from "@/store/auth";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const statusColor: Record<RequestStatus, string> = {
  Pending: "bg-warning text-warning-foreground",
  Approved: "bg-primary text-primary-foreground",
  Rejected: "bg-destructive text-destructive-foreground",
  Fulfilled: "bg-success text-success-foreground",
};

const priorityColor = (p: string) =>
  p === "Urgent" ? "bg-destructive" : p === "High" ? "bg-primary" : p === "Medium" ? "bg-warning" : "bg-success";

const formatTime = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodRequests = () => {
  const { t } = useTranslation();
  const requests = useRequests();
  const auth = useAuth();
  const isAdmin = auth.currentUser?.role === "admin";
  const [tab, setTab] = useState<string>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [editReq, setEditReq] = useState<BloodRequest | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    bloodGroup: "", units: "", hospital: "", patient: "", age: "", priority: "High", contact: "", notes: "",
  });

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchesTab =
        tab === "all" ||
        (tab === "pending" && r.status === "Pending") ||
        (tab === "approved" && r.status === "Approved") ||
        (tab === "rejected" && r.status === "Rejected") ||
        (tab === "fulfilled" && r.status === "Fulfilled");
      const ql = q.toLowerCase();
      const matchesQ = !q || r.patient.toLowerCase().includes(ql) || r.hospital.toLowerCase().includes(ql) || r.bloodGroup.toLowerCase().includes(ql);
      return matchesTab && matchesQ;
    });
  }, [requests, tab, q]);

  const openEdit = (r: BloodRequest) => {
    setEditForm({
      bloodGroup: r.bloodGroup, units: String(r.units), hospital: r.hospital,
      patient: r.patient, age: String(r.age), priority: r.priority,
      contact: r.contact || "", notes: r.notes || "",
    });
    setEditReq(r);
  };

  const saveEdit = () => {
    if (!editReq) return;
    requestStore.update(editReq.id, {
      bloodGroup: editForm.bloodGroup,
      units: parseInt(editForm.units) || 1,
      hospital: editForm.hospital,
      patient: editForm.patient,
      age: parseInt(editForm.age) || 0,
      priority: editForm.priority as BloodRequest["priority"],
      contact: editForm.contact,
      notes: editForm.notes,
    });
    toast({ title: "Request updated" });
    setEditReq(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      requestStore.remove(deleteId);
      toast({ title: "Request deleted" });
      setDeleteId(null);
    }
  };

  return (
    <AppLayout title={t("blood_requests.page_title")}>
      <div className="flex items-center justify-between -mt-4 mb-6">
        <p className="text-sm text-muted-foreground">{t("blood_requests.subtitle")}</p>
        <Link to="/request-blood"><Button size="sm">{t("blood_requests.new_request")}</Button></Link>
      </div>
      <Card className="p-6 border-0 shadow-card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">{t("blood_requests.all")}</TabsTrigger>
              <TabsTrigger value="pending">{t("blood_requests.pending")}</TabsTrigger>
              <TabsTrigger value="approved">{t("blood_requests.approved")}</TabsTrigger>
              <TabsTrigger value="rejected">{t("blood_requests.rejected")}</TabsTrigger>
              <TabsTrigger value="fulfilled">{t("blood_requests.fulfilled")}</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("blood_requests.search_ph")} className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="divide-y divide-border">
          {filtered.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">{t("blood_requests.no_requests")}</div>}
          {filtered.map((r) => {
            const isOpen = openId === r.id;
            return (
              <div key={r.id} className="py-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">{r.bloodGroup}</div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-bold">{r.units} Unit{r.units > 1 ? "s" : ""} · {r.patient}</div>
                    <div className="text-xs text-muted-foreground">{r.hospital}</div>
                    <div className="text-xs text-muted-foreground">{t("blood_requests.age_label")} {r.age}{r.requiredDate ? ` · Needed by ${r.requiredDate}` : ""}</div>
                  </div>
                  <Badge className={priorityColor(r.priority)}>{r.priority}</Badge>
                  <Badge className={statusColor[r.status]}>{r.status}</Badge>
                  <div className="text-xs text-muted-foreground hidden md:block w-32 text-right">{formatTime(r.createdAt)}</div>
                  <div className="flex gap-1">
                    {isAdmin && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(r)}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setOpenId(isOpen ? null : r.id)}>
                      {isOpen ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                      {isOpen ? t("blood_requests.hide") : t("blood_requests.history")}
                    </Button>
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-4 ml-16 border-l-2 border-primary/20 pl-4 space-y-3">
                    {r.notes && <div className="text-sm"><span className="font-semibold">{t("blood_requests.note")}</span> {r.notes}</div>}
                    {r.contact && <div className="text-sm"><span className="font-semibold">{t("blood_requests.contact")}</span> {r.contact}</div>}
                    <div className="text-sm font-semibold mt-2">{t("blood_requests.status_history")}</div>
                    {r.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" /></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className={statusColor[h.status]}>{h.status}</Badge>
                            <span className="text-xs text-muted-foreground">{formatTime(h.at)} · {h.by}</span>
                          </div>
                          {h.note && <div className="text-xs text-muted-foreground mt-1">{h.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editReq} onOpenChange={(o) => !o && setEditReq(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("blood_requests.edit_title")}</DialogTitle>
            <DialogDescription>{t("blood_requests.edit_desc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t("blood_requests.blood_group")}</Label>
                <Select value={editForm.bloodGroup} onValueChange={(v) => setEditForm((f) => ({ ...f, bloodGroup: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{bloodGroups.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>{t("blood_requests.units")}</Label><Input type="number" value={editForm.units} onChange={(e) => setEditForm((f) => ({ ...f, units: e.target.value }))} className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t("blood_requests.patient")}</Label><Input value={editForm.patient} onChange={(e) => setEditForm((f) => ({ ...f, patient: e.target.value }))} className="mt-1" /></div>
              <div><Label>{t("blood_requests.age")}</Label><Input type="number" value={editForm.age} onChange={(e) => setEditForm((f) => ({ ...f, age: e.target.value }))} className="mt-1" /></div>
            </div>
            <div><Label>{t("blood_requests.hospital")}</Label><Input value={editForm.hospital} onChange={(e) => setEditForm((f) => ({ ...f, hospital: e.target.value }))} className="mt-1" /></div>
            <div><Label>{t("blood_requests.contact")}</Label><Input value={editForm.contact} onChange={(e) => setEditForm((f) => ({ ...f, contact: e.target.value }))} className="mt-1" /></div>
            <div><Label>{t("blood_requests.notes")}</Label><Textarea value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditReq(null)}>{t("blood_requests.cancel")}</Button>
            <Button onClick={saveEdit}>{t("blood_requests.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("blood_requests.delete_title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("blood_requests.delete_desc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("blood_requests.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">{t("blood_requests.delete_btn")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default BloodRequests;
