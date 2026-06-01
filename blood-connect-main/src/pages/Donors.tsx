import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MessageCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { donors } from "@/data/mock";

const Donors = () => (
  <AppLayout title="Search Donors">
    <p className="text-sm text-muted-foreground -mt-4 mb-6">Find blood donors near you</p>
    <Card className="p-6 border-0 shadow-card">
      <div className="grid md:grid-cols-4 gap-3">
        <Select><SelectTrigger><SelectValue placeholder="Blood Group" /></SelectTrigger>
          <SelectContent>{["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
        <Input placeholder="Tirunelveli, Tamil Nadu" />
        <Select><SelectTrigger><SelectValue placeholder="10 km" /></SelectTrigger>
          <SelectContent>{["5 km","10 km","25 km","50 km"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
        <Button><Search className="h-4 w-4 mr-2" />Search</Button>
      </div>
    </Card>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {donors.map((d) => (
        <Card key={d.id} className="p-5 border-0 shadow-card text-center">
          <div className="relative inline-block">
            <Avatar className="h-20 w-20 mx-auto border-4 border-primary-soft">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">{d.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
            </Avatar>
            <Badge className="absolute -top-1 -right-1 bg-primary">{d.bloodGroup}</Badge>
          </div>
          <Link to={`/donors/${d.id}`} className="block mt-3 font-bold hover:text-primary">{d.name}</Link>
          <div className="text-xs text-muted-foreground mt-1">{d.distance}</div>
          <div className="flex items-center justify-center gap-1 text-xs mt-2">
            <span className={`h-2 w-2 rounded-full ${d.available ? "bg-success" : "bg-muted-foreground"}`} />
            {d.available ? "Available" : "Unavailable"}
          </div>
          <div className="flex justify-center gap-2 mt-3">
            <Button size="icon" variant="outline" className="h-8 w-8"><Phone className="h-3 w-3" /></Button>
            <Button size="icon" variant="outline" className="h-8 w-8"><MessageCircle className="h-3 w-3" /></Button>
          </div>
        </Card>
      ))}
    </div>
  </AppLayout>
);

export default Donors;
