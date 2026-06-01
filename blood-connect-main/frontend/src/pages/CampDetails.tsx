import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Phone, User } from "lucide-react";
import { useCamps } from "@/store/camps";
import { useParams, Link } from "react-router-dom";

const CampDetails = () => {
  const { id } = useParams();
  const camps = useCamps();
  const camp = camps.find((c) => c.id === id);

  if (!camp) {
    return (
      <AppLayout title="Camp Not Found">
        <p className="text-muted-foreground">The camp you're looking for doesn't exist.</p>
        <Link to="/camps"><Button className="mt-4">Back to Camps</Button></Link>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={camp.name}>
      <div className="grid lg:grid-cols-3 gap-6 -mt-4">
        <div className="lg:col-span-2">
          <Card className="p-6 border-0 shadow-card mt-4">
            <h2 className="text-xl font-bold">{camp.name}</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-primary" />{camp.date}</div>
              <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-primary" />{camp.time}</div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" />{camp.location}</div>
              <div className="flex items-center gap-3"><User className="h-4 w-4 text-primary" />{camp.organizer}</div>
              {camp.contactPhone && <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" />{camp.contactPhone}</div>}
            </div>
            {camp.description && <p className="mt-4 text-sm">{camp.description}</p>}
          </Card>
        </div>
        <Card className="p-6 border-0 shadow-card h-fit">
          <h3 className="font-bold text-lg mb-3">Camp Status</h3>
          <Badge className={camp.status === "upcoming" ? "bg-primary" : camp.status === "completed" ? "bg-success" : "bg-destructive"}>
            {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
          </Badge>
          <Button className="w-full mt-6">Register for Camp</Button>
          <Link to="/camps"><Button variant="outline" className="w-full mt-2">Back to Camps</Button></Link>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CampDetails;
