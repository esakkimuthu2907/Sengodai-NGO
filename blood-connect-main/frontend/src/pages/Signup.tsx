import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authStore } from "@/store/auth";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { states, districts, places, bloodGroups } from "../data/tamilnadu";

const titles = ["Mr", "Mrs", "Ms", "Dr"];
const qualifications = ["10th", "12th", "Diploma", "Graduate", "Post Graduate", "PhD", "Other"];
const idDocuments = ["Aadhaar", "PAN Card", "Voter ID", "Passport", "Driving License"];

const Signup = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const steps = [t("signup.step1"), t("signup.step2"), t("signup.step3")];

  const [form, setForm] = useState({
    state: "", district: "",
    title: "", firstName: "", lastName: "", occupation: "",
    bloodGroup: "", gender: "Male", qualification: "", idDocument: "",
    workProfile: "", address: "", area: "", country: "India", zipcode: "",
    phone: "", email: "", dob: "",
    password: "", confirmPassword: "",
    role: "volunteer", adminSecret: ""
  });

  const set = <K extends keyof typeof form>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validateStep = () => {
    if (step === 1) {
      if (!form.state || !form.district) {
        toast({ title: "Please select State and District", variant: "destructive" });
        return false;
      }
    }
    if (step === 2) {
      if (!form.firstName.trim() || !form.bloodGroup || !form.gender || !form.address.trim() || !form.zipcode.trim() || !form.phone.trim() || !form.email.trim()) {
        toast({ title: "Please fill all required fields (*)", variant: "destructive" });
        return false;
      }
      if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(form.email)) {
        toast({ title: "Please enter a valid email", variant: "destructive" });
        return false;
      }
      if (!/^\d{10}$/.test(form.phone)) {
        toast({ title: "Please enter a valid 10-digit mobile number", variant: "destructive" });
        return false;
      }
    }
    if (step === 3) {
      if (!form.password || form.password.length < 6) {
        toast({ title: "Password must be at least 6 characters", variant: "destructive" });
        return false;
      }
      if (form.password !== form.confirmPassword) {
        toast({ title: "Passwords do not match", variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit registration
      const result = await authStore.signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        adminSecret: form.adminSecret,
        bloodGroup: form.bloodGroup,
        dob: form.dob,
        gender: form.gender,
        state: form.state,
        district: form.district,
        occupation: form.occupation,
        qualification: form.qualification,
        idDocument: form.idDocument,
        workProfile: form.workProfile,
        address: form.address,
        area: form.area,
        country: form.country,
        zipcode: form.zipcode,
        title: form.title,
      });
      if (!result.success) {
        toast({ title: "Registration Failed", description: result.error, variant: "destructive" });
        return;
      }
      toast({ title: "Registration Successful!", description: "You can now login with your credentials." });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-5">
      {/* Left branding */}
      <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center bg-[hsl(220,30%,15%)] text-white p-12 relative">
        <div className="text-center">
          <img
            src="/sengodai-logo.png"
            alt="Sengodai Logo"
            className="h-28 w-28 rounded-full mx-auto mb-6 border-4 border-white/20 shadow-xl"
          />
          <h2 className="text-3xl font-extrabold">{t("signup.title")}</h2>
          <p className="text-white/60 mt-2">{t("signup.subtitle")}</p>
        </div>
      </div>

      {/* Right form */}
      <div className="lg:col-span-3 flex flex-col justify-start p-6 lg:p-10 overflow-y-auto max-h-screen">
        <div className="lg:hidden mb-6"><Logo /></div>
        <Card className="p-6 lg:p-8 border-0 shadow-card max-w-2xl w-full mx-auto">
          <h1 className="text-2xl font-bold text-center">{t("signup.title")}</h1>

          {/* Step Indicator */}
          <div className="flex items-center justify-center my-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i + 1 <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {i + 1 < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 ${i + 1 <= step ? "text-primary font-semibold" : "text-muted-foreground"}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${i + 1 < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Region */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>{t("signup.select_state")}</Label>
                <Select value={form.state} onValueChange={(v) => { set("state", v); set("district", ""); set("area", ""); }}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={t("signup.select_state")} /></SelectTrigger>
                  <SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("signup.select_district")}</Label>
                <Select value={form.district} onValueChange={(v) => { set("district", v); set("area", ""); }} disabled={!form.state}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={t("signup.select_district")} /></SelectTrigger>
                  <SelectContent>{(districts[form.state] || []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("signup.select_place")}</Label>
                <Select value={form.area} onValueChange={(v) => set("area", v)} disabled={!form.district}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={t("signup.select_place")} /></SelectTrigger>
                  <SelectContent>
                    {(places[form.district] || []).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    <SelectItem value="Other">{t("signup.other_place")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <Label>{t("signup.select_title")}</Label>
                <Select value={form.title} onValueChange={(v) => set("title", v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={t("signup.select_title")} /></SelectTrigger>
                  <SelectContent>{titles.map((tItem) => <SelectItem key={tItem} value={tItem}>{tItem}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t("signup.first_name")}</Label>
                  <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder={t("signup.first_name")} className="mt-1" />
                </div>
                <div>
                  <Label>{t("signup.last_name")}</Label>
                  <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder={t("signup.last_name")} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>{t("signup.occupation")}</Label>
                <Input value={form.occupation} onChange={(e) => set("occupation", e.target.value)} placeholder={t("signup.occupation")} className="mt-1" />
              </div>
              <div>
                <Label>{t("signup.register_as")}</Label>
                <Select value={form.role} onValueChange={(v) => set("role", v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder={t("signup.register_as")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">{t("login.volunteer")}</SelectItem>
                    <SelectItem value="user">{t("signup.donor")}</SelectItem>
                    <SelectItem value="admin">{t("login.admin")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.role === "admin" && (
                <div>
                  <Label>{t("signup.admin_secret")}</Label>
                  <Input
                    type="password"
                    value={form.adminSecret}
                    onChange={(e) => set("adminSecret", e.target.value)}
                    className="mt-1"
                    placeholder={t("signup.admin_secret")}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t("signup.blood_group")}</Label>
                  <Select value={form.bloodGroup} onValueChange={(v) => set("bloodGroup", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder={t("signup.blood_group")} /></SelectTrigger>
                    <SelectContent>{bloodGroups.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("signup.dob")}</Label>
                  <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>{t("signup.gender")}</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {["Male", "Female", "Others"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => set("gender", g)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        form.gender === g ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t("signup.qualification")}</Label>
                  <Select value={form.qualification} onValueChange={(v) => set("qualification", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder={t("signup.qualification")} /></SelectTrigger>
                    <SelectContent>{qualifications.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("signup.id_doc")}</Label>
                  <Select value={form.idDocument} onValueChange={(v) => set("idDocument", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder={t("signup.id_doc")} /></SelectTrigger>
                    <SelectContent>{idDocuments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>{t("signup.work_profile")}</Label>
                <Input value={form.workProfile} onChange={(e) => set("workProfile", e.target.value)} placeholder={t("signup.work_profile")} className="mt-1" />
              </div>
              <div>
                <Label>{t("signup.address")}</Label>
                <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder={t("signup.address")} className="mt-1" />
              </div>
              <div>
                <Label>{t("signup.area")} {form.area && form.area !== "Other" ? `(Selected: ${form.area})` : ""}</Label>
                <Input 
                  value={form.area === "Other" ? "" : form.area} 
                  onChange={(e) => set("area", e.target.value)} 
                  placeholder={t("signup.area")} 
                  className="mt-1" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t("signup.country")}</Label>
                  <Select value={form.country} onValueChange={(v) => set("country", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder={t("signup.country")} /></SelectTrigger>
                    <SelectContent><SelectItem value="India">India</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("signup.zipcode")}</Label>
                  <Input value={form.zipcode} onChange={(e) => set("zipcode", e.target.value)} placeholder={t("signup.zipcode")} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t("signup.mobile_no")}</Label>
                  <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t("signup.mobile_no")} className="mt-1" />
                </div>
                <div>
                  <Label>{t("signup.email")}</Label>
                  <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t("signup.email")} className="mt-1" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Account Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="relative">
                <Label>{t("signup.password")}</Label>
                <Input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder={t("signup.password")}
                  className="mt-1"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-8 text-muted-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative">
                <Label>{t("signup.confirm_password")}</Label>
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  placeholder={t("signup.confirm_password")}
                  className="mt-1"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-8 text-muted-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="p-4 rounded-lg bg-secondary/60 text-sm">
                <h4 className="font-semibold mb-2">{t("signup.summary")}</h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <span>{t("signup.name_lbl")} <strong className="text-foreground">{form.title} {form.firstName} {form.lastName}</strong></span>
                  <span>{t("signup.bg_lbl")} <strong className="text-foreground">{form.bloodGroup}</strong></span>
                  <span>{t("signup.phone_lbl")} <strong className="text-foreground">{form.phone}</strong></span>
                  <span>{t("signup.email_lbl")} <strong className="text-foreground">{form.email}</strong></span>
                  <span>{t("signup.loc_lbl")} <strong className="text-foreground">{form.district}, {form.state}</strong></span>
                  <span>{t("signup.gender_lbl")} <strong className="text-foreground">{form.gender}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                {t("signup.prev")}
              </Button>
            )}
            <Button className="flex-1" onClick={handleNext}>
              {step < 3 ? t("signup.next") : t("signup.complete")}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {t("signup.have_account")} <Link to="/login" className="text-primary font-semibold">{t("login.login_btn")}</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
