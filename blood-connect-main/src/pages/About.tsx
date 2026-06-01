import { PublicHeader, PublicFooter } from "@/components/PublicHeader";
import { Card } from "@/components/ui/card";
import { Heart, Users, Award } from "lucide-react";

const About = () => (
  <div className="min-h-screen flex flex-col">
    <PublicHeader />
    <main className="flex-1">
      <section className="container py-16">
        <h1 className="text-5xl font-extrabold">About <span className="text-gradient">Sengodai</span></h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
          Sengodai Blood Foundation is a community-driven initiative committed to bridging the gap between donors and patients across Tamil Nadu.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {[
            { icon: Heart, t: "Our Mission", d: "Save lives by ensuring access to safe blood for everyone in need." },
            { icon: Users, t: "Our Community", d: "12,540+ active donors across hundreds of cities and towns." },
            { icon: Award, t: "Our Impact", d: "25,870+ lives saved through 320+ camps since inception." },
          ].map((b) => (
            <Card key={b.t} className="p-6 border-0 shadow-card">
              <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                <b.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">{b.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{b.d}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
    <PublicFooter />
  </div>
);

export default About;
