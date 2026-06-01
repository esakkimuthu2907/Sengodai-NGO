import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Droplet } from "lucide-react";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { requestStore } from "@/store/requests";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    errorMap: () => ({ message: "Select a blood group" }),
  }),
  units: z.coerce.number().int().min(1, "At least 1 unit").max(10, "Max 10 units"),
  hospital: z.string().trim().min(3, "Hospital name required").max(120),
  patient: z.string().trim().min(2, "Patient name required").max(80),
  age: z.coerce.number().int().min(1, "Enter valid age").max(120),
  contact: z
    .string()
    .trim()
    .regex(/^[+\d\s-]{7,15}$/, "Enter a valid phone"),
  requiredDate: z.string().min(1, "Pick a date"),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  notes: z.string().max(500).optional(),
});

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const RequestBlood = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    bloodGroup: "",
    units: "",
    hospital: "",
    patient: "",
    age: "",
    contact: "",
    requiredDate: "",
    priority: "High" as "Low" | "Medium" | "High" | "Urgent",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as keyof FormErrors;
        if (!fieldErrors[key]) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      toast({ title: "Please fix the errors", variant: "destructive" });
      return;
    }
    setErrors({});
    setSubmitting(true);
    const created = requestStore.add(parsed.data as Parameters<typeof requestStore.add>[0]);
    setSubmitting(false);
    toast({ title: "Request submitted", description: `Request #${created.id.slice(-6)} is pending approval.` });
    navigate("/blood-requests");
  };

  const err = (k: keyof FormErrors) =>
    errors[k] ? <p className="text-xs text-destructive mt-1">{errors[k]}</p> : null;

  return (
    <AppLayout title="Request Blood">
      <p className="text-sm text-muted-foreground -mt-4 mb-6">Fill the details to request blood</p>
      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-0 shadow-card space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Blood Group Needed</Label>
              <Select value={form.bloodGroup} onValueChange={(v) => set("bloodGroup", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select blood group" /></SelectTrigger>
                <SelectContent>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
              {err("bloodGroup")}
            </div>
            <div>
              <Label>Units Required</Label>
              <Input type="number" min={1} max={10} value={form.units} onChange={(e) => set("units", e.target.value)} className="mt-1" placeholder="2" />
              {err("units")}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Patient Name</Label>
              <Input value={form.patient} onChange={(e) => set("patient", e.target.value)} className="mt-1" placeholder="Patient name" maxLength={80} />
              {err("patient")}
            </div>
            <div>
              <Label>Patient Age</Label>
              <Input type="number" min={1} max={120} value={form.age} onChange={(e) => set("age", e.target.value)} className="mt-1" placeholder="35" />
              {err("age")}
            </div>
          </div>
          <div>
            <Label>Hospital / Location</Label>
            <Input value={form.hospital} onChange={(e) => set("hospital", e.target.value)} placeholder="Apollo Hospital, Chennai" className="mt-1" maxLength={120} />
            {err("hospital")}
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Contact Number</Label>
              <Input value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="+91 98765 43210" className="mt-1" />
              {err("contact")}
            </div>
            <div>
              <Label>Required Date</Label>
              <Input type="date" value={form.requiredDate} onChange={(e) => set("requiredDate", e.target.value)} className="mt-1" />
              {err("requiredDate")}
            </div>
          </div>
          <div>
            <Label>Urgency Level</Label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {(["Low","Medium","High","Urgent"] as const).map((u) => (
                <button
                  type="button"
                  key={u}
                  onClick={() => set("priority", u)}
                  className={`py-2.5 rounded-lg border text-sm font-medium ${form.priority === u ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Additional Note (Optional)</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Enter any additional information..." className="mt-1" maxLength={500} />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </Card>

        <Card className="p-6 border-0 shadow-card bg-primary-soft text-center h-fit">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4">
            <Droplet className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-primary text-lg">Every Drop Counts</h3>
          <p className="text-sm text-muted-foreground mt-2">Your request will be notified to available donors immediately after admin approval.</p>
        </Card>
      </form>
    </AppLayout>
  );
};

export default RequestBlood;
