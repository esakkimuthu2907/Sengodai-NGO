import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Search, CheckCircle2, XCircle, PackageCheck, History } from "lucide-react";
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

const AdminRequests = () => {
  const requests = useRequests();
  const [tab, setTab] = useState("pending");
  const [q, setQ] = useState("");
  const [action, setAction] = useState<{ req: BloodRequest; status: RequestStatus } | null>(null);
  const [note, setNote] = useState("");
  const [historyOf, setHistoryOf] = useState<BloodRequest | null>(null);

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

  const counts = {
    pending: requests.filter((r) => r.status === "Pending").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    rejected: requests.filter((r) => r.status === "Rejected").length,
    fulfilled: requests.filter((r) => r.status === "Fulfilled").length,
  };

  return (
    <AppLayout title="Admin · Blood Requests">
      <p className="text-sm text-muted-foreground -mt-4 mb-6">Approve, reject and update blood request statuses</p>

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
                {["Group","Patient","Hospital","Units","Priority","Status","Submitted","Actions"].map((h) => (
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
    </AppLayout>
  );
};

export default AdminRequests;
