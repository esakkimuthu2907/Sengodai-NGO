import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin } from "lucide-react";
import camp1 from "@/assets/camp-1.jpg";
import { camps } from "@/data/mock";
import { Link } from "react-router-dom";

const Camps = () => (
  <AppLayout title="Blood Donation Camps">
    <p className="text-sm text-muted-foreground -mt-4 mb-6">Find and join upcoming blood donation camps</p>
    <Card className="p-6 border-0 shadow-card">
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Camps</TabsTrigger>
            <TabsTrigger value="past">Past Camps</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button>Organize Camp</Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...camps, ...camps].map((c, i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-card">
            <img src={camp1} alt={c.name} loading="lazy" width={400} height={200} className="w-full h-40 object-cover" />
            <div className="p-5">
              <h3 className="font-bold">{c.name}</h3>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{c.date}</div>
                <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{c.time}</div>
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{c.location}</div>
              </div>
              <Link to={`/camps/${c.id}`}>
                <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary-soft">Register Now</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  </AppLayout>
);

export default Camps;
