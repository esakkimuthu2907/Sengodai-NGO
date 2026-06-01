import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { useRequests, type RequestStatus } from "@/store/requests";
import { Link } from "react-router-dom";

const statusColor: Record<RequestStatus, string> = {
  Pending: "bg-warning text-warning-foreground",
  Approved: "bg-primary text-primary-foreground",
  Rejected: "bg-destructive text-destructive-foreground",
  Fulfilled: "bg-success text-success-foreground",
};

const priorityColor = (p: string) =>
  p === "Urgent" ? "bg-destructive" : p === "High" ? "bg-primary" : p === "Medium" ? "bg-warning" : "bg-success";

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const BloodRequests = () => {
  const requests = useRequests();
  const [tab, setTab] = useState<string>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchesTab =
        tab === "all" ||
        (tab === "pending" && r.status === "Pending") ||
        (tab === "approved" && r.status === "Approved") ||
        (tab === "rejected" && r.status === "Rejected") ||
        (tab === "fulfilled" && r.status === "Fulfilled");
      const ql = q.toLowerCase();
      const matchesQ =
        !q ||
        r.patient.toLowerCase().includes(ql) ||
        r.hospital.toLowerCase().includes(ql) ||
        r.bloodGroup.toLowerCase().includes(ql);
      return matchesTab && matchesQ;
    });
  }, [requests, tab, q]);

  return (
    <AppLayout title="Blood Requests">
      <div className="flex items-center justify-between -mt-4 mb-6">
        <p className="text-sm text-muted-foreground">View and track blood requests</p>
        <Link to="/request-blood"><Button size="sm">+ New Request</Button></Link>
      </div>
      <Card className="p-6 border-0 shadow-card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patient, hospital..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="divide-y divide-border">
          {filtered.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">No requests found.</div>}
          {filtered.map((r) => {
            const isOpen = openId === r.id;
            return (
              <div key={r.id} className="py-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">{r.bloodGroup}</div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-bold">{r.units} Unit{r.units > 1 ? "s" : ""} · {r.patient}</div>
                    <div className="text-xs text-muted-foreground">{r.hospital}</div>
                    <div className="text-xs text-muted-foreground">Age: {r.age}{r.requiredDate ? ` · Needed by ${r.requiredDate}` : ""}</div>
                  </div>
                  <Badge className={priorityColor(r.priority)}>{r.priority}</Badge>
                  <Badge className={statusColor[r.status]}>{r.status}</Badge>
                  <div className="text-xs text-muted-foreground hidden md:block w-32 text-right">{formatTime(r.createdAt)}</div>
                  <Button size="sm" variant="outline" onClick={() => setOpenId(isOpen ? null : r.id)}>
                    {isOpen ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                    {isOpen ? "Hide" : "History"}
                  </Button>
                </div>
                {isOpen && (
                  <div className="mt-4 ml-16 border-l-2 border-primary/20 pl-4 space-y-3">
                    {r.notes && <div className="text-sm"><span className="font-semibold">Note:</span> {r.notes}</div>}
                    {r.contact && <div className="text-sm"><span className="font-semibold">Contact:</span> {r.contact}</div>}
                    <div className="text-sm font-semibold mt-2">Status History</div>
                    {r.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" /></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className={statusColor[h.status]} >{h.status}</Badge>
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
    </AppLayout>
  );
};

export default BloodRequests;
