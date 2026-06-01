import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, CheckCircle2, XCircle, PackageCheck, History, Edit, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { requestStore, useRequests, type BloodRequest, type RequestStatus } from "@/store/requests";
import { toast } from "@/hooks/use-toast";

const statusColor: Record<RequestStatus, string> = {
  Pending: "bg-warning text-warning-foreground",
  Approved: "bg-primary text-primary-foreground",
  Rejected: "bg-destructive text-destructive-foreground",
  Fulfilled: "bg-success text-success-foreground",
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AdminRequests = () => {
  const requests = useRequests();
  const [tab, setTab] = useState("pending");
  const [q, setQ] = useState("");
  const [action, setAction] = useState<{ req: BloodRequest; status: RequestStatus } | null>(null);
  const [note, setNote] = useState("");
  const [historyOf, setHistoryOf] = useState<BloodRequest | null>(null);
  const [editReq, setEditReq] = useState<BloodRequest | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailReq, setDetailReq] = useState<BloodRequest | null>(null);
  const [editForm, setEditForm] = useState({
    bloodGroup: "", units: "", hospital: "", patient: "", age: "", priority: "High" as string, contact: "", notes: "",
  });

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const m =
        tab === "all" ||
        (tab === "pending" && r.status === "Pending") ||
        (tab === "approved" && r.status === "Approved") ||
        (tab === "rejected" && r.status === "Rejected") ||
        (tab === "fulfilled" && r.status === "Fulfilled");
      const ql = q.toLowerCase();
      return m && (!q || r.patient.toLowerCase().includes(ql) || r.hospital.toLowerCase().includes(ql) || r.bloodGroup.toLowerCase().includes(ql));
    });
  }, [requests, tab, q]);

  const openAction = (req: BloodRequest, status: RequestStatus) => {
    setAction({ req, status });
    setNote("");
  };

  const confirm = () => {
    if (!action) return;
    if (action.status === "Rejected" && note.trim().length < 3) {
      toast({ title: "Reason required", description: "Please provide a rejection reason.", variant: "destructive" });
      return;
    }
    requestStore.updateStatus(action.req.id, action.status, note.trim() || `Marked ${action.status}`, "Admin");
    toast({ title: `Request ${action.status.toLowerCase()}`, description: `#${action.req.id.slice(-6)} updated.` });
    setAction(null);
  };

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

  const counts = {
    pending: requests.filter((r) => r.status === "Pending").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    rejected: requests.filter((r) => r.status === "Rejected").length,
    fulfilled: requests.filter((r) => r.status === "Fulfilled").length,
  };

  return (
    <AppLayout title="Admin · Blood Requests">
      <p className="text-sm text-muted-foreground -mt-4 mb-6">Approve, reject, edit and delete blood requests</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {([
          ["Pending", counts.pending, "warning"],
          ["Approved", counts.approved, "primary"],
          ["Fulfilled", counts.fulfilled, "success"],
          ["Rejected", counts.rejected, "destructive"],
        ] as const).map(([label, n]) => (
          <Card key={label} className="p-4 border-0 shadow-card">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-2xl font-bold mt-1">{n}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6 border-0 shadow-card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                {["Group", "Patient", "Hospital", "Units", "Priority", "Status", "Submitted", "Actions"].map((h) => (
                  <th key={h} className="py-3 px-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No requests.</td></tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border hover:bg-secondary/40">
                  <td className="py-3 px-2"><Badge className="bg-primary">{r.bloodGroup}</Badge></td>
                  <td className="py-3 px-2 font-semibold">{r.patient}<div className="text-xs text-muted-foreground font-normal">Age {r.age}</div></td>
                  <td className="py-3 px-2 text-muted-foreground">{r.hospital}</td>
                  <td className="py-3 px-2">{r.units}</td>
                  <td className="py-3 px-2">{r.priority}</td>
                  <td className="py-3 px-2"><Badge className={statusColor[r.status]}>{r.status}</Badge></td>
                  <td className="py-3 px-2 text-xs text-muted-foreground">{formatTime(r.createdAt)}</td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {r.status === "Pending" && (
                        <>
                          <Button size="sm" variant="ghost" className="text-success" onClick={() => openAction(r, "Approved")}>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />Approve
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => openAction(r, "Rejected")}>
                            <XCircle className="h-3.5 w-3.5 mr-1" />Reject
                          </Button>
                        </>
                      )}
                      {r.status === "Approved" && (
                        <Button size="sm" variant="ghost" className="text-primary" onClick={() => openAction(r, "Fulfilled")}>
                          <PackageCheck className="h-3.5 w-3.5 mr-1" />Fulfill
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-primary" onClick={() => setDetailReq(r)}>
                        <Search className="h-3.5 w-3.5 mr-1" />Details
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>
                        <Edit className="h-3.5 w-3.5 mr-1" />Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(r.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-1" />Delete
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setHistoryOf(r)}>
                        <History className="h-3.5 w-3.5 mr-1" />History
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail View Dialog */}
      <Dialog open={!!detailReq} onOpenChange={(o) => !o && setDetailReq(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Blood Request Details</DialogTitle>
            <DialogDescription>Full request and requester information</DialogDescription>
          </DialogHeader>
          {detailReq && (
            <div className="space-y-4 text-sm mt-2">
              <div className="border-b border-border pb-3">
                <h4 className="font-bold text-primary mb-2">Request Information</h4>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-muted-foreground">Patient:</div>
                  <div className="font-semibold">{detailReq.patient} (Age {detailReq.age})</div>
                  <div className="text-muted-foreground">Blood Needed:</div>
                  <div className="font-bold text-red-500">{detailReq.bloodGroup} ({detailReq.units} units)</div>
                  <div className="text-muted-foreground">Urgency:</div>
                  <div className="font-semibold">{detailReq.priority}</div>
                  <div className="text-muted-foreground">Hospital:</div>
                  <div className="font-semibold">{detailReq.hospital}</div>
                  <div className="text-muted-foreground">Status:</div>
                  <div><Badge className={statusColor[detailReq.status]}>{detailReq.status}</Badge></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-primary mb-2">Requester Information (Linked via Foreign Key)</h4>
                {detailReq.requester ? (
                  <div className="grid grid-cols-2 gap-y-2 bg-secondary/30 p-3 rounded-lg border border-border/50">
                    <div className="text-muted-foreground">Name:</div>
                    <div className="font-semibold">{detailReq.requester.name}</div>
                    <div className="text-muted-foreground">Role:</div>
                    <div className="capitalize font-semibold">{detailReq.requester.role}</div>
                    <div className="text-muted-foreground">Email:</div>
                    <div className="font-semibold text-xs break-all">{detailReq.requester.email}</div>
                    <div className="text-muted-foreground">Phone:</div>
                    <div className="font-semibold">{detailReq.requester.phone || "N/A"}</div>
                    <div className="text-muted-foreground">Location:</div>
                    <div className="font-semibold">{detailReq.requester.location || "N/A"}</div>
                    <div className="text-muted-foreground">Blood Group:</div>
                    <div className="font-semibold">{detailReq.requester.bloodGroup || "N/A"}</div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs italic">Requester details not available.</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailReq(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Action Dialog */}
      <Dialog open={!!action} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action?.status === "Approved" && "Approve Request"}
              {action?.status === "Rejected" && "Reject Request"}
              {action?.status === "Fulfilled" && "Mark as Fulfilled"}
            </DialogTitle>
            <DialogDescription>
              {action && <>#{action.req.id.slice(-6)} · {action.req.patient} · {action.req.bloodGroup} · {action.req.units} unit(s)</>}
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium">
              {action?.status === "Rejected" ? "Reason (required)" : "Note (optional)"}
            </label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} className="mt-1" placeholder="Add a note..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
            <Button onClick={confirm} className={action?.status === "Rejected" ? "bg-destructive hover:bg-destructive/90" : ""}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editReq} onOpenChange={(o) => !o && setEditReq(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Blood Request</DialogTitle>
            <DialogDescription>Update request details</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Blood Group</Label>
                <Select value={editForm.bloodGroup} onValueChange={(v) => setEditForm((f) => ({ ...f, bloodGroup: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{bloodGroups.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Units</Label>
                <Input type="number" value={editForm.units} onChange={(e) => setEditForm((f) => ({ ...f, units: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Patient</Label>
                <Input value={editForm.patient} onChange={(e) => setEditForm((f) => ({ ...f, patient: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Age</Label>
                <Input type="number" value={editForm.age} onChange={(e) => setEditForm((f) => ({ ...f, age: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Hospital</Label>
              <Input value={editForm.hospital} onChange={(e) => setEditForm((f) => ({ ...f, hospital: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Priority</Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {(["Low", "Medium", "High", "Urgent"] as const).map((u) => (
                  <button key={u} type="button" onClick={() => setEditForm((f) => ({ ...f, priority: u }))}
                    className={`py-2 rounded-lg border text-xs font-medium ${editForm.priority === u ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Contact</Label>
              <Input value={editForm.contact} onChange={(e) => setEditForm((f) => ({ ...f, contact: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditReq(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={!!historyOf} onOpenChange={(o) => !o && setHistoryOf(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Status History</DialogTitle>
            <DialogDescription>
              {historyOf && <>#{historyOf.id.slice(-6)} · {historyOf.patient}</>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {historyOf?.history.map((h, i) => (
              <div key={i} className="border-l-2 border-primary/30 pl-3">
                <div className="flex items-center gap-2">
                  <Badge className={statusColor[h.status]}>{h.status}</Badge>
                  <span className="text-xs text-muted-foreground">{formatTime(h.at)} · {h.by}</span>
                </div>
                {h.note && <div className="text-xs text-muted-foreground mt-1">{h.note}</div>}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Request?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default AdminRequests;
