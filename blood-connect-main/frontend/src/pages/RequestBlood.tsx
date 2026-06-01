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
import { useTranslation } from "react-i18next";

import { bloodGroups } from "../data/tamilnadu";

const schema = z.object({
  bloodGroup: z.string().refine((val) => bloodGroups.includes(val), {
    message: "Select a blood group",
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
  const { t } = useTranslation();
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

  const onSubmit = async (e: React.FormEvent) => {
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
    
    try {
      const created = await requestStore.add(parsed.data as Parameters<typeof requestStore.add>[0]);
      toast({ title: "Request submitted", description: `Request #${created.id.slice(-6)} is pending approval.` });
      navigate("/blood-requests");
    } catch (e: any) {
      toast({ title: "Failed to submit", description: e.response?.data?.message || "An error occurred", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const err = (k: keyof FormErrors) =>
    errors[k] ? <p className="text-xs text-destructive mt-1">{errors[k]}</p> : null;

  return (
    <AppLayout title={t("request_blood.page_title")}>
      <p className="text-sm text-muted-foreground -mt-4 mb-6">{t("request_blood.subtitle")}</p>
      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-0 shadow-card space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>{t("request_blood.blood_group")}</Label>
              <Select value={form.bloodGroup} onValueChange={(v) => set("bloodGroup", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder={t("request_blood.blood_group_ph")} /></SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
              {err("bloodGroup")}
            </div>
            <div>
              <Label>{t("request_blood.units")}</Label>
              <Input type="number" min={1} max={10} value={form.units} onChange={(e) => set("units", e.target.value)} className="mt-1" placeholder="2" />
              {err("units")}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>{t("request_blood.patient")}</Label>
              <Input value={form.patient} onChange={(e) => set("patient", e.target.value)} className="mt-1" placeholder={t("request_blood.patient_ph")} maxLength={80} />
              {err("patient")}
            </div>
            <div>
              <Label>{t("request_blood.patient_age")}</Label>
              <Input type="number" min={1} max={120} value={form.age} onChange={(e) => set("age", e.target.value)} className="mt-1" placeholder="35" />
              {err("age")}
            </div>
          </div>
          <div>
            <Label>{t("request_blood.hospital")}</Label>
            <Input value={form.hospital} onChange={(e) => set("hospital", e.target.value)} placeholder={t("request_blood.hospital_ph")} className="mt-1" maxLength={120} />
            {err("hospital")}
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>{t("request_blood.contact")}</Label>
              <Input value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder={t("request_blood.contact_ph")} className="mt-1" />
              {err("contact")}
            </div>
            <div>
              <Label>{t("request_blood.required_date")}</Label>
              <Input type="date" value={form.requiredDate} onChange={(e) => set("requiredDate", e.target.value)} className="mt-1" />
              {err("requiredDate")}
            </div>
          </div>
          <div>
            <Label>{t("request_blood.urgency")}</Label>
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
            <Label>{t("request_blood.notes")}</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t("request_blood.notes_ph")} className="mt-1" maxLength={500} />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? t("request_blood.submitting") : t("request_blood.submit")}
          </Button>
        </Card>

        <Card className="p-6 border-0 shadow-card bg-primary-soft text-center h-fit">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4">
            <Droplet className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-primary text-lg">{t("request_blood.tip_title")}</h3>
          <p className="text-sm text-muted-foreground mt-2">{t("request_blood.tip_desc")}</p>
        </Card>
      </form>
    </AppLayout>
  );
};

export default RequestBlood;
