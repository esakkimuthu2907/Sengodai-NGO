import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useParams, Link } from "react-router-dom";
import { donors } from "@/data/mock";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Briefcase, CheckCircle2 } from "lucide-react";

const DonorDetails = () => {
  const { id } = useParams();
  const donor = donors.find(d => d.id === id) || donors[0];
  return (
    <AppLayout>
      <Link to="/donors" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Donors
      </Link>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-0 shadow-card">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20 border-4 border-primary-soft">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{donor.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{donor.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-primary">{donor.bloodGroup}</Badge>
                <Badge variant="outline" className="border-success text-success">{donor.available ? "Available" : "Unavailable"}</Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Phone, label: "Phone", value: donor.phone },
              { icon: Mail, label: "Email", value: donor.email },
              { icon: MapPin, label: "Address", value: donor.address },
              { icon: Calendar, label: "Last Donation", value: donor.lastDonation },
              { icon: Briefcase, label: "Occupation", value: donor.occupation },
              { icon: Calendar, label: "Age / Gender", value: `${donor.age} / ${donor.gender}` },
            ].map((f) => (
              <div key={f.label} className="flex gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary-soft flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{f.label}</div>
                  <div className="text-sm font-semibold">{f.value}</div>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-6 w-full">Edit Donor</Button>
        </Card>

        <div className="space-y-4">
          <Card className="p-6 border-0 shadow-card bg-success/5 border-success/20">
            <h3 className="font-bold flex items-center gap-2 text-success"><CheckCircle2 className="h-5 w-5" />Donation Eligibility</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />You are eligible to donate blood</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />You can donate after 12 Jul 2026</li>
            </ul>
          </Card>
          <Card className="p-6 border-0 shadow-card bg-primary-soft">
            <h3 className="font-bold">Quick Donate</h3>
            <p className="text-sm text-muted-foreground mt-1">Find nearby blood donation camps or donate.</p>
            <Link to="/camps"><Button className="mt-4 w-full">View Camps</Button></Link>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DonorDetails;
