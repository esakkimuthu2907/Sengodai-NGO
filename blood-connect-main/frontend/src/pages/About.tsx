import { PublicHeader, PublicFooter } from "@/components/PublicHeader";
import { Card } from "@/components/ui/card";
import { Heart, Users, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
  <div className="min-h-screen flex flex-col">
    <PublicHeader />
    <main className="flex-1">
      <section className="container py-16">
        <h1 className="text-5xl font-extrabold">{t("about.title_1")} <span className="text-gradient">{t("about.title_2")}</span></h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
          {t("about.desc")}
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {[
            { icon: Heart, t: t("about.mission"), d: t("about.mission_desc") },
            { icon: Users, t: t("about.community"), d: t("about.community_desc") },
            { icon: Award, t: t("about.impact"), d: t("about.impact_desc") },
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
};

export default About;
