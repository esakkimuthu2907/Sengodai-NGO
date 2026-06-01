import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { donors } from "@/data/mock";
import { Edit, Search, Plus } from "lucide-react";

const AdminUsers = () => (
  <AppLayout title="Donors Management">
    <p className="text-sm text-muted-foreground -mt-4 mb-6">Manage and view all registered donors</p>
    <Card className="p-6 border-0 shadow-card">
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search donors..." className="pl-9" />
        </div>
        <Select><SelectTrigger className="md:w-40"><SelectValue placeholder="Blood Group" /></SelectTrigger>
          <SelectContent>{["All","A+","B+","O+","AB+"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
        <Select><SelectTrigger className="md:w-40"><SelectValue placeholder="District" /></SelectTrigger>
          <SelectContent>{["All","Tirunelveli","Erode","Chennai"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
        <Button><Plus className="h-4 w-4 mr-2" />Add Donor</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              {["Name","Blood Group","Location","Last Donation","Availability","Action"].map(h => <th key={h} className="py-3 px-2 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {donors.map((d) => (
              <tr key={d.id} className="border-b border-border hover:bg-secondary/40">
                <td className="py-3 px-2 font-semibold">{d.name}</td>
                <td className="py-3 px-2"><Badge className="bg-primary">{d.bloodGroup}</Badge></td>
                <td className="py-3 px-2 text-muted-foreground">{d.location}</td>
                <td className="py-3 px-2 text-muted-foreground">{d.lastDonation}</td>
                <td className="py-3 px-2">
                  <Badge variant="outline" className={d.available ? "border-success text-success" : "border-muted-foreground text-muted-foreground"}>
                    {d.available ? "Available" : "Not Available"}
                  </Badge>
                </td>
                <td className="py-3 px-2">
                  <Button size="sm" variant="ghost" className="text-primary"><Edit className="h-3 w-3 mr-1" />Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </AppLayout>
);

export default AdminUsers;
