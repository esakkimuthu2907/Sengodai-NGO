import { PublicHeader, PublicFooter } from "@/components/PublicHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen flex flex-col">
    <PublicHeader />
    <main className="flex-1 container py-16">
      <h1 className="text-5xl font-extrabold">Get in <span className="text-gradient">Touch</span></h1>
      <p className="text-lg text-muted-foreground mt-4">We'd love to hear from you.</p>
      <div className="grid lg:grid-cols-3 gap-6 mt-10">
        <div className="space-y-4">
          {[
            { icon: Phone, t: "Phone", v: "+91 98765 43210" },
            { icon: Mail, t: "Email", v: "hello@sengodai.org" },
            { icon: MapPin, t: "Address", v: "Tirunelveli, Tamil Nadu" },
          ].map((c) => (
            <Card key={c.t} className="p-5 border-0 shadow-card flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary-soft flex items-center justify-center">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{c.t}</div>
                <div className="font-semibold">{c.v}</div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="lg:col-span-2 p-6 border-0 shadow-card space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Name</Label><Input className="mt-1" placeholder="Your name" /></div>
            <div><Label>Email</Label><Input className="mt-1" type="email" placeholder="you@email.com" /></div>
          </div>
          <div><Label>Subject</Label><Input className="mt-1" placeholder="How can we help?" /></div>
          <div><Label>Message</Label><Textarea className="mt-1" rows={5} placeholder="Your message..." /></div>
          <Button size="lg" className="w-full">Send Message</Button>
        </Card>
      </div>
    </main>
    <PublicFooter />
  </div>
);

export default Contact;
