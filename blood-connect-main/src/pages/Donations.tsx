import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake } from "lucide-react";

const Donations = () => (
  <AppLayout title="My Donations">
    <p className="text-sm text-muted-foreground -mt-4 mb-6">Your donation history</p>
    <div className="space-y-3">
      {[1,2,3,4,5].map((i) => (
        <Card key={i} className="p-5 border-0 shadow-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center">
            <HeartHandshake className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-bold">Sengodai Mega Blood Camp #{i}</div>
            <div className="text-xs text-muted-foreground">{15 - i} {["Jan","Feb","Mar","Apr","May"][i-1]} 2026 · Tirunelveli</div>
          </div>
          <Badge className="bg-success">Completed</Badge>
        </Card>
      ))}
    </div>
  </AppLayout>
);

export default Donations;
