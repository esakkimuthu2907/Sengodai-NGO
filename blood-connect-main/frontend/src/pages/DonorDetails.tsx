import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useDonors } from "@/store/donors";

const DonorDetails = () => {
  const { id } = useParams();
  const donors = useDonors();
  const donor = donors.find((d) => d.id === id);

  if (!donor) {
    return (
      <AppLayout title="Donor Not Found">
        <p className="text-muted-foreground">The donor you're looking for doesn't exist.</p>
        <Link to="/donors"><Button className="mt-4">Back to Donors</Button></Link>
      </AppLayout>
    );
  }

  const initials = donor.name.split(" ").map((n) => n[0]).join("");

  return (
    <AppLayout>
      <Link to="/donors" className="inline-flex items-center gap-1 text-sm text-primary font-semibold mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Donors
      </Link>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 border-0 shadow-card text-center">
          <Avatar className="h-24 w-24 mx-auto border-4 border-primary-soft">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="font-bold text-xl mt-4">{donor.name}</h2>
          <Badge className="bg-primary mt-2">{donor.bloodGroup}</Badge>
          <div className="mt-4 space-y-2 text-left text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{donor.phone}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{donor.email}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{donor.address || donor.location}</div>
          </div>
          <Badge variant="outline" className={`mt-4 ${donor.available ? "border-success text-success" : "border-muted-foreground text-muted-foreground"}`}>
            {donor.available ? "● Available" : "● Not Available"}
          </Badge>
        </Card>

        <Card className="lg:col-span-2 p-6 border-0 shadow-card">
          <h3 className="font-bold text-lg mb-4">Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            {[
              ["Blood Group", donor.bloodGroup],
              ["Age", `${donor.age} years`],
              ["Gender", donor.gender],
              ["Weight", donor.weight],
              ["Occupation", donor.occupation],
              ["Location", donor.location],
              ["Last Donation", donor.lastDonation],
              ["Distance", donor.distance],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <Button className="flex-1"><Phone className="h-4 w-4 mr-2" />Call Donor</Button>
            <Button variant="outline" className="flex-1"><Mail className="h-4 w-4 mr-2" />Send Email</Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DonorDetails;
