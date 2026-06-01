import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";

const Profile = () => (
  <AppLayout title="My Profile">
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="p-6 border-0 shadow-card text-center">
        <Avatar className="h-24 w-24 mx-auto border-4 border-primary-soft">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">RK</AvatarFallback>
        </Avatar>
        <h2 className="font-bold text-xl mt-4">Ramesh Kumar</h2>
        <p className="text-sm text-muted-foreground">ramesh@email.com</p>
        <Badge className="bg-primary mt-2">B+ Blood Group</Badge>
        <div className="mt-6 space-y-2 text-left text-sm">
          <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />+91 98765 43210</div>
          <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />ramesh@email.com</div>
          <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />Tirunelveli, Tamil Nadu</div>
        </div>
        <Badge variant="outline" className="border-success text-success mt-4">● Available</Badge>
        <Button className="w-full mt-4">Edit Profile</Button>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 border-0 shadow-card">
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Personal Info</TabsTrigger>
              <TabsTrigger value="history">Donation History</TabsTrigger>
              <TabsTrigger value="docs">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-6">
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                {[
                  ["Blood Group", "B+"],
                  ["Date of Birth", "15 Aug 1998"],
                  ["Gender", "Male"],
                  ["Weight", "70 kg"],
                  ["Last Donation", "15 Mar 2026"],
                  ["Total Donations", "5"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-6 space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <div className="font-semibold">Sengodai Blood Camp</div>
                    <div className="text-xs text-muted-foreground">12 Jan 2026 · Erode, Tamil Nadu</div>
                  </div>
                  <Badge className="bg-success">Completed</Badge>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="docs" className="mt-6">
              <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-5 border-0 shadow-card">
            <h3 className="font-bold mb-3">Availability Status</h3>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-success text-success">● Available</Badge>
              <Switch defaultChecked />
            </div>
          </Card>
          <Card className="p-5 border-0 shadow-card">
            <h3 className="font-bold mb-2">Next Eligible Donation</h3>
            <div className="flex items-center gap-2 text-primary"><Calendar className="h-4 w-4" /><span className="font-bold">15 June 2026</span></div>
            <p className="text-xs text-muted-foreground mt-1">12 days remaining</p>
          </Card>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Profile;
