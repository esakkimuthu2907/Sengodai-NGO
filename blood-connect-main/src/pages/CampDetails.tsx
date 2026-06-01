import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft, CheckCircle2, FileText, Award } from "lucide-react";
import camp1 from "@/assets/camp-1.jpg";
import { Link, useParams } from "react-router-dom";
import { camps } from "@/data/mock";

const CampDetails = () => {
  const { id } = useParams();
  const camp = camps.find(c => c.id === id) || camps[0];
  return (
    <AppLayout>
      <Link to="/camps" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Camps
      </Link>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <img src={camp1} alt={camp.name} width={800} height={400} className="rounded-2xl w-full h-64 object-cover" />
          <Card className="p-6 border-0 shadow-card">
            <h1 className="text-2xl font-bold">{camp.name}</h1>
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-primary" />{camp.date}</div>
              <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-primary" />{camp.time}</div>
              <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" />{camp.location}</div>
            </div>
            <div className="mt-6">
              <h3 className="font-bold mb-2">Organized By</h3>
              <p className="text-sm text-muted-foreground">Sengodai Blood Foundation in association with local hospitals.</p>
            </div>
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {[
                { icon: CheckCircle2, label: "Free Health Checkup" },
                { icon: FileText, label: "Refreshments Provided" },
                { icon: Award, label: "Certificate of Appreciation" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 p-3 rounded-lg bg-primary-soft text-sm">
                  <f.icon className="h-4 w-4 text-primary shrink-0" />{f.label}
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full" size="lg">Register for Camp</Button>
          </Card>
        </div>
        <Card className="p-6 border-0 shadow-card h-fit">
          <h3 className="font-bold mb-4">Location</h3>
          <div className="aspect-square rounded-xl bg-secondary flex items-center justify-center">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mt-3">{camp.location}</p>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CampDetails;
