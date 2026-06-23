import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Phone, Mail, MapPin, Calendar, Edit2, Camera, Droplet, Clock, CreditCard } from "lucide-react";
import { useAuth, authStore } from "@/store/auth";
import { useDonations } from "@/store/donations";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { states, districts, bloodGroups } from "../data/tamilnadu";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const user = auth.currentUser;
  const donations = useDonations();
  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "??";
  const volunteerId = user?.id ? `SDBC${new Date(user.createdAt).getFullYear()}${user.id.slice(-5).toUpperCase()}` : "SDBC000000";
  const isAdmin = user?.role === "admin";
  const isApproved = isAdmin || user?.status === "Approved";
  const approvalLabel = isAdmin ? "Approved" : user?.status || "Pending";
  const myDonations = donations.filter((d) => d.donorId === user?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bloodGroup: "",
    location: "",
    district: "",
    state: "",
    address: "",
    lastDonationDate: "",
    occupation: "",
    qualification: "",
    idDocument: "",
    idDocumentNumber: "",
    gender: "Male",
    dob: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        bloodGroup: user.bloodGroup || "O+",
        location: user.location || "",
        district: user.district || "",
        state: user.state || "",
        address: user.address || "",
        lastDonationDate: user.lastDonationDate ? new Date(user.lastDonationDate).toISOString().split('T')[0] : "",
        occupation: user.occupation || "",
        qualification: user.qualification || "",
        idDocument: user.idDocument || "",
        idDocumentNumber: (user as any).idDocumentNumber || "",
        gender: user.gender || "Male",
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
      });
    }
  }, [user]);

  // Compute next donation date (90 days after last donation)
  const lastDonation = user?.lastDonationDate ? new Date(user.lastDonationDate) : null;
  const nextDonationDate = lastDonation ? new Date(lastDonation.getTime() + 90 * 24 * 60 * 60 * 1000) : null;
  const now = new Date();
  const canDonateNow = !nextDonationDate || nextDonationDate <= now;
  const daysUntilNextDonation = nextDonationDate ? Math.max(0, Math.ceil((nextDonationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

  const toggleAvailability = async () => {
    if (user) {
      await authStore.updateProfile({ isAvailableForDonation: !user.isAvailableForDonation } as any);
      toast({ title: "Availability updated" });
    }
  };

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large. Max 5MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        await authStore.updateProfile({ profileImage: base64 } as any);
        toast({ title: "Profile photo updated! ✓" });
      } catch {
        toast({ title: "Failed to upload photo", variant: "destructive" });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.firstName.trim() || !form.phone.trim()) {
      toast({ title: "First name and Phone are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const updatedData: any = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        bloodGroup: form.bloodGroup,
        location: form.location || `${form.district || ""}, ${form.state || ""}`.trim() || "Unknown",
        district: form.district,
        state: form.state,
        address: form.address,
        lastDonationDate: form.lastDonationDate || undefined,
        occupation: form.occupation,
        qualification: form.qualification,
        idDocument: form.idDocument,
        idDocumentNumber: form.idDocumentNumber,
        gender: form.gender,
        dob: form.dob || undefined,
      };
      if (form.password) {
        updatedData.password = form.password;
      }
      const success = await authStore.updateProfile(updatedData);
      if (success) {
        toast({ title: "Profile updated successfully ✓" });
        setIsEditing(false);
      } else {
        toast({ title: "Failed to update profile", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Failed to update profile", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const userDob = user?.dob ? new Date(user.dob) : null;
  const formattedDob = userDob ? userDob.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
  const userLocation = user?.district && user?.state ? `${user.district}, ${user.state}` : user?.location || 'N/A';

  return (
    <AppLayout title={t("profile.page_title")}>
      {/* Hidden file input for profile photo */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left sidebar - User Card */}
        <Card className="p-6 border-0 shadow-card text-center relative overflow-hidden">
          <div className="relative inline-block">
            <Avatar className="h-28 w-28 mx-auto border-4 border-primary-soft">
              {(user as any)?.profileImage ? (
                <AvatarImage src={(user as any).profileImage} alt={user?.firstName} />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors border-2 border-white"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h2 className="font-bold text-xl mt-4">{user?.firstName} {user?.lastName}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Badge className="bg-primary mt-2">{user?.bloodGroup || "N/A"} Blood Group</Badge>
          <div className="mt-6 space-y-2 text-left text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{user?.phone}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{user?.email}</div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {userLocation}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Badge variant="outline" className={`mx-auto ${user?.isAvailableForDonation !== false ? "border-success text-success" : "border-muted-foreground text-muted-foreground"}`}>
            {user?.isAvailableForDonation !== false ? t("profile.available") : t("profile.not_available")}
            </Badge>
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-3.5 w-3.5 mr-2" />{t("profile.edit_profile")}
            </Button>
          </div>
        </Card>

        {/* Right content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-0 shadow-card">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">{t("profile.personal_info")}</TabsTrigger>
                <TabsTrigger value="history">{t("profile.donation_history")}</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-6">
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  {[
                    ["Blood Group", user?.bloodGroup || "N/A"],
                    ["Gender", user?.gender || "N/A"],
                    ["Date of Birth", formattedDob],
                    ["District", user?.district || "N/A"],
                    ["State", user?.state || "N/A"],
                    ["Address", user?.address || user?.location || "N/A"],
                    ["Phone", user?.phone || "N/A"],
                    ["Email", user?.email || "N/A"],
                    ["Occupation", (user as any)?.occupation || "N/A"],
                    ["Qualification", (user as any)?.qualification || "N/A"],
                    ["ID Document", (user as any)?.idDocument || "N/A"],
                    ["ID Number", (user as any)?.idDocumentNumber || "N/A"],
                    ["Approval", approvalLabel],
                    ["Role", user?.role === "admin" ? "Administrator" : "Volunteer"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-6 space-y-3">
                {myDonations.length === 0 && <p className="text-sm text-muted-foreground">{t("profile.no_donations")}</p>}
                {myDonations.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <div className="font-semibold">{d.campName}</div>
                      <div className="text-xs text-muted-foreground">{d.date} · {d.location}</div>
                    </div>
                    <Badge className={d.status === "Completed" ? "bg-success" : d.status === "Scheduled" ? "bg-primary" : "bg-destructive"}>
                      {d.status}
                    </Badge>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Next Donation Date + Availability */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5 border-0 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Droplet className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Next Donation Date</h3>
              </div>
              {lastDonation ? (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Last donated on</div>
                  <div className="text-sm font-semibold">{lastDonation.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  {canDonateNow ? (
                    <Badge className="bg-success">✓ Eligible to donate now!</Badge>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-semibold text-orange-600">{daysUntilNextDonation} days remaining</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Next eligible: <strong>{nextDonationDate?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${Math.min(100, ((90 - daysUntilNextDonation) / 90) * 100)}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No donation recorded yet. Update your last donation date via Edit Profile.
                </div>
              )}
            </Card>

            <Card className="p-5 border-0 shadow-card">
              <h3 className="font-bold mb-3">{t("profile.availability")}</h3>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={user?.isAvailableForDonation !== false ? "border-success text-success" : "border-muted-foreground text-muted-foreground"}>
                  {user?.isAvailableForDonation !== false ? t("profile.available") : t("profile.not_available")}
                </Badge>
                <Switch checked={user?.isAvailableForDonation !== false} onCheckedChange={toggleAvailability} />
              </div>
              <div className="mt-4 flex items-center gap-2 text-primary">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Member since {joinDate}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Role: {user?.role === "admin" ? "Administrator" : "Volunteer"}</p>
            </Card>
          </div>
        </div>
      </div>

      {/* ===== VOLUNTEER ID CARD ===== */}
      {isApproved && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Volunteer ID Card</h2>
          <div className="flex justify-center">
            <div
              className="relative w-[380px] rounded-3xl overflow-hidden shadow-2xl border border-red-100"
              style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fff5f5 100%)' }}
            >
              {/* Top red wave with branding */}
              <div className="relative h-[140px] overflow-hidden">
                <svg viewBox="0 0 380 140" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <path d="M0,0 L380,0 L380,80 Q300,140 190,100 Q80,60 0,120 Z" fill="#DC2626" />
                  <path d="M0,0 L380,0 L380,60 Q300,120 190,80 Q80,40 0,100 Z" fill="#EF4444" opacity="0.6" />
                </svg>
                <div className="relative z-10 p-6 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <Droplet className="h-6 w-6 text-white" fill="white" />
                    </div>
                    <div>
                      <div className="text-white font-extrabold text-lg tracking-wide">SENGODAI</div>
                      <div className="text-white/90 text-xs font-semibold">BLOOD CONNECT</div>
                      <div className="text-white/70 text-[10px] italic">Donate Blood, Save Lives ❤️</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile photo circle */}
              <div className="flex justify-center -mt-14 relative z-20">
                <div className="h-28 w-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  {(user as any)?.profileImage ? (
                    <img src={(user as any).profileImage} alt={user?.firstName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                      <span className="text-3xl font-bold text-red-400">{initials}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Role */}
              <div className="text-center mt-3 px-6">
                <h3 className="text-xl font-extrabold text-gray-800 tracking-wide">{user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}</h3>
                <div className="inline-block mt-2 px-4 py-1 bg-red-600 text-white text-[10px] font-bold rounded uppercase tracking-[0.15em]">
                  {user?.role === 'admin' ? 'Administrator' : 'Donor Volunteer'}
                </div>
              </div>

              {/* Details */}
              <div className="px-8 mt-5 space-y-3 pb-2">
                {[
                  { icon: '🩸', label: 'Blood Group', value: user?.bloodGroup || 'N/A' },
                  { icon: '📅', label: 'Date of Birth', value: formattedDob },
                  { icon: '🆔', label: 'Member ID', value: volunteerId },
                  { icon: '📋', label: 'Join Date', value: joinDate },
                  { icon: '📍', label: 'Location', value: userLocation },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-gray-500 w-28">{item.label}</span>
                    <span className="font-bold text-gray-800">:&nbsp;&nbsp;{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Bottom wave + tagline */}
              <div className="relative h-[70px] mt-4 overflow-hidden">
                <svg viewBox="0 0 380 70" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <path d="M0,30 Q95,0 190,20 Q285,40 380,10 L380,70 L0,70 Z" fill="#FEE2E2" />
                  <path d="M0,40 Q95,10 190,30 Q285,50 380,20 L380,70 L0,70 Z" fill="#FECACA" opacity="0.5" />
                </svg>
                <div className="relative z-10 flex items-center justify-center h-full">
                  <span className="text-red-600 font-bold italic text-sm">One Drop Can Save a Life ❤️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Section */}
      {isApproved && (
        <Card className="mt-6 p-6 border-0 shadow-card bg-gradient-to-br from-success/10 to-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-semibold">{t("profile.cert_title")}</div>
              <h2 className="mt-2 text-2xl font-bold">{t("profile.cert_h2")}</h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-xl">{t("profile.cert_desc")}</p>
            </div>
            <img src="/sengodai-logo.png" alt="Sengodai logo" className="h-20 w-20 object-contain rounded-full bg-white p-3" />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="text-xs text-muted-foreground">{t("profile.recipient")}</div>
              <div className="mt-2 text-lg font-semibold">{user?.firstName} {user?.lastName}</div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="text-xs text-muted-foreground">{t("profile.date")}</div>
              <div className="mt-2 text-lg font-semibold">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="text-xs text-muted-foreground">{t("profile.cert_id")}</div>
              <div className="text-sm font-semibold">{volunteerId}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{t("profile.authorized")}</div>
              <div className="mt-2 text-sm font-semibold">Sengodai Blood Foundation</div>
            </div>
          </div>
        </Card>
      )}

      {!isApproved && (
        <Card className="mt-6 p-6 border-0 shadow-card bg-warning/10">
          <div className="space-y-3">
            <div className="inline-flex rounded-full bg-warning/10 px-3 py-1 text-sm font-semibold text-warning">{t("profile.pending_label")}</div>
            <h3 className="text-xl font-bold">{t("profile.pending_h3")}</h3>
            <p className="text-sm text-muted-foreground">{t("profile.pending_desc")}</p>
          </div>
        </Card>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("profile.edit_dialog_title")}</DialogTitle>
            <DialogDescription>{t("profile.edit_dialog_desc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t("profile.first_name")}</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>{t("profile.last_name")}</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Blood Group</Label>
                <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{bloodGroups.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>State</Label>
                <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v, district: "" })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select State" /></SelectTrigger>
                  <SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>District</Label>
                <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })} disabled={!form.state}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select District" /></SelectTrigger>
                  <SelectContent>{(districts[form.state] || []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input value={form.address || form.location} onChange={(e) => setForm({ ...form, address: e.target.value, location: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Occupation</Label>
                <Input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Qualification</Label>
                <Input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>ID Document</Label>
                <Input value={form.idDocument} onChange={(e) => setForm({ ...form, idDocument: e.target.value })} className="mt-1" placeholder="e.g. Aadhaar" />
              </div>
              <div>
                <Label>ID Number</Label>
                <Input value={form.idDocumentNumber} onChange={(e) => setForm({ ...form, idDocumentNumber: e.target.value })} className="mt-1" placeholder="Document number" />
              </div>
            </div>
            <div className="rounded-xl bg-primary/5 p-4">
              <Label className="flex items-center gap-2 text-primary font-semibold">
                <Droplet className="h-4 w-4" /> Last Blood Donation Date
              </Label>
              <Input type="date" value={form.lastDonationDate} onChange={(e) => setForm({ ...form, lastDonationDate: e.target.value })} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">The system will automatically calculate your next eligible donation date (90 days).</p>
            </div>
            <div className="border-t border-border pt-3 mt-3">
              <Label className="font-semibold text-primary">Change Password (Optional)</Label>
              <Input type="password" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter new password to change" className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">Leave blank if you do not want to change your password.</p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>{t("profile.cancel")}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : t("profile.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Profile;
