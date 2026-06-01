import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const items = [
  { title: "New blood request match found", desc: "A match for B+ blood request available.", time: "2 min ago", unread: true },
  { title: "Donation camp reminder", desc: "Don't forget about the camp on 25 May 2026.", time: "1 hour ago", unread: true },
  { title: "Thank you for your donation!", desc: "Your donation on 15 Jun 2026 has saved a life.", time: "1 day ago", unread: false },
  { title: "Urgent blood request", desc: "Urgent request needed at Government Hospital.", time: "1 day ago", unread: true },
  { title: "Camp registration confirmed", desc: "You are registered for Mega Blood Camp.", time: "2 days ago", unread: false },
];

const Messages = () => (
  <AppLayout title="Messages">
    <p className="text-sm text-muted-foreground -mt-4 mb-6">Notifications & messages</p>
    <Card className="p-6 border-0 shadow-card">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="notif">Notifications</TabsTrigger>
          <TabsTrigger value="msg">Messages</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-6 divide-y divide-border">
        {items.map((m, i) => (
          <div key={i} className={`flex gap-4 py-4 ${m.unread ? "bg-primary-soft/30 -mx-6 px-6" : ""}`}>
            <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary text-primary-foreground text-xs">SB</AvatarFallback></Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{m.title}</span>
                {m.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{m.desc}</div>
            </div>
            <div className="text-xs text-muted-foreground">{m.time}</div>
          </div>
        ))}
      </div>
    </Card>
  </AppLayout>
);

export default Messages;
