import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Search, Plus, Trash2, Shield, User as UserIcon, UserCheck } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { authStore, useAuth, type User } from "@/store/auth";
import api from "@/lib/axios";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const roles = ["admin", "volunteer", "user"];

const emptyUser = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "volunteer" as User["role"],
  phone: "",
  location: "",
  bloodGroup: "O+",
  available: true,
  status: "Pending" as User["status"],
};

const AdminUsers = () => {
  const auth = useAuth();
  const users = auth.users;
  const [q, setQ] = useState("");
  const [bgFilter, setBgFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(emptyUser);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    authStore.fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const matchQ =
        !q ||
        fullName.includes(q.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(q.toLowerCase());
      const matchBg = bgFilter === "All" || u.bloodGroup === bgFilter;
      const matchRole = roleFilter === "All" || u.role === roleFilter;
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      return matchQ && matchBg && matchRole && matchStatus;
    });
  }, [users, q, bgFilter, roleFilter, statusFilter]);

  const openNew = () => {
    setForm(emptyUser);
    setIsNew(true);
    setEditUser({} as User);
  };

  const openEdit = (u: User) => {
    setForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      password: "",
      role: u.role || "volunteer",
      phone: u.phone || "",
      location: u.location || "",
      bloodGroup: u.bloodGroup || "O+",
      available: u.available !== false,
      status: u.status || "Pending",
    });
    setIsNew(false);
    setEditUser(u);
  };

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.email.trim() || !form.phone.trim()) {
      toast({ title: "Please fill required fields (First Name, Email, Phone)", variant: "destructive" });
      return;
    }
    
    try {
      if (isNew) {
        const payload = {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password || "password123",
          role: form.role,
          bloodGroup: form.bloodGroup,
          phone: form.phone,
          location: form.location || "Unknown",
          status: form.role === "admin" ? "Approved" : form.status,
        };
        await api.post("/users", payload);
        toast({ title: "User created successfully" });
      } else if (editUser?.id) {
        const payload = { ...form };
        if (form.role === "admin") {
          payload.status = "Approved";
        }
        const updated = await authStore.updateUser(editUser.id, payload);
        if (updated) {
          toast({ title: "User updated successfully" });
        } else {
          toast({ title: "User update failed", variant: "destructive" });
        }
      }
      setEditUser(null);
      authStore.fetchUsers();
    } catch (e: any) {
      toast({
        title: "Operation failed",
        description: e.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await authStore.removeUser(deleteId);
        toast({ title: "User deleted" });
        setDeleteId(null);
        authStore.fetchUsers();
      } catch (e: any) {
        toast({
          title: "Delete failed",
          description: e.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      }
    }
  };

  const updateStatus = async (user: User, status: "Approved" | "Rejected") => {
    try {
      const updated = await authStore.updateUser(user.id, { status });
      if (updated) {
        toast({ title: `User ${status.toLowerCase()} successfully` });
        await authStore.fetchUsers();
      } else {
        toast({ title: "Status update failed", variant: "destructive" });
      }
    } catch (e: any) {
      toast({
        title: "Status update failed",
        description: e.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3.5 w-3.5 mr-1 text-primary" />;
      case "volunteer":
        return <UserCheck className="h-3.5 w-3.5 mr-1 text-success" />;
      default:
        return <UserIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout title="Users Management">
      <p className="text-sm text-muted-foreground -mt-4 mb-6">Manage and view all registered users and volunteers</p>
      <Card className="p-6 border-0 shadow-card">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users by name or email..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={bgFilter} onValueChange={setBgFilter}>
            <SelectTrigger className="md:w-40"><SelectValue placeholder="Blood Group" /></SelectTrigger>
            <SelectContent>{["All", ...bloodGroups].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="md:w-40"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>{["All", ...roles].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>{["All", "Pending", "Approved", "Rejected"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Add User / Volunteer</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                {['Name', 'Role', 'Blood Group', 'Location', 'Phone', 'Status', 'Availability', 'Actions'].map((h) => (
                  <th key={h} className="py-3 px-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No users found.</td></tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-secondary/40">
                  <td className="py-3 px-2 font-semibold">
                    {u.firstName} {u.lastName}
                    <div className="text-xs text-muted-foreground font-normal">{u.email}</div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="flex items-center text-xs font-semibold capitalize">
                      {getRoleIcon(u.role)}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-2"><Badge className="bg-primary">{u.bloodGroup || "N/A"}</Badge></td>
                  <td className="py-3 px-2 text-muted-foreground">{u.location || "N/A"}</td>
                  <td className="py-3 px-2 text-muted-foreground">{u.phone || "N/A"}</td>
                  <td className="py-3 px-2">
                    <Badge className={
                      u.status === "Approved" ? "bg-success" : u.status === "Rejected" ? "bg-destructive" : "bg-warning"
                    }>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant="outline" className={u.available ? "border-success text-success" : "border-muted-foreground text-muted-foreground"}>
                      {u.available ? "Active / Available" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="ghost" className="text-primary" onClick={() => openEdit(u)}><Edit className="h-3 w-3 mr-1" />Edit</Button>
                      {u.role !== "admin" && u.status === "Pending" && (
                        <>
                          <Button size="sm" variant="ghost" className="text-success" onClick={() => updateStatus(u, "Approved")}><UserCheck className="h-3 w-3 mr-1" />Approve</Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateStatus(u, "Rejected")}><Trash2 className="h-3 w-3 mr-1" />Reject</Button>
                        </>
                      )}
                      {u.id !== "admin-001" && u.email !== "admin@sengodai.org" && (
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(u.id)}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add New User / Volunteer" : "Edit User"}</DialogTitle>
            <DialogDescription>{isNew ? "Fill in the details to register a new user" : "Update user information"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name*</Label>
                <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className="mt-1" placeholder="First name" />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className="mt-1" placeholder="Last name" />
              </div>
            </div>
            <div>
              <Label>Email Address*</Label>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1" placeholder="email@example.com" disabled={!isNew} />
            </div>
            {isNew && (
              <div>
                <Label>Password*</Label>
                <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className="mt-1" placeholder="Enter password" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Role*</Label>
                <Select value={form.role} onValueChange={(v) => set("role", v as User["role"])}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>{roles.map((r) => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Blood Group*</Label>
                <Select value={form.bloodGroup} onValueChange={(v) => set("bloodGroup", v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select group" /></SelectTrigger>
                  <SelectContent>{bloodGroups.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>            <div>
              <Label>Approval Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as User["status"]) }>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  {['Pending', 'Approved', 'Rejected'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Phone*</Label>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1" placeholder="+91 98765 43210" />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => set("location", e.target.value)} className="mt-1" placeholder="e.g. Tirunelveli" />
              </div>
            </div>
            <div>
              <Label>Status / Availability</Label>
              <Select value={form.available ? "yes" : "no"} onValueChange={(v) => set("available", v === "yes")}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Active / Available</SelectItem>
                  <SelectItem value="no">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleSave}>{isNew ? "Add User" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The user account and all associated profile details will be permanently removed.</AlertDialogDescription>
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

export default AdminUsers;
