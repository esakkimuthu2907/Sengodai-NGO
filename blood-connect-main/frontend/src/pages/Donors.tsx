import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MessageCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useDonors } from "@/store/donors";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Donors = () => {
  const { t } = useTranslation();
  const donors = useDonors();
  const [bg, setBg] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return donors.filter((d) => {
      const matchBg = bg === "All" || d.bloodGroup === bg;
      const matchQ = !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.location.toLowerCase().includes(q.toLowerCase());
      return matchBg && matchQ;
    });
  }, [donors, bg, q]);

  return (
    <AppLayout title={t("donors.page_title")}>
      <p className="text-sm text-muted-foreground -mt-4 mb-6">{t("donors.subtitle")}</p>
      <Card className="p-6 border-0 shadow-card">
        <div className="grid md:grid-cols-4 gap-3">
          <Select value={bg} onValueChange={setBg}>
            <SelectTrigger><SelectValue placeholder={t("donors.blood_group")} /></SelectTrigger>
            <SelectContent>{["All", ...bloodGroups].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder={t("donors.search_ph")} value={q} onChange={(e) => setQ(e.target.value)} />
          <Select><SelectTrigger><SelectValue placeholder={t("donors.distance")} /></SelectTrigger>
            <SelectContent>{["5 km", "10 km", "25 km", "50 km"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
          <Button><Search className="h-4 w-4 mr-2" />{t("donors.search_btn")}</Button>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-sm text-muted-foreground">{t("donors.no_donors")}</div>
        )}
        {filtered.map((d) => (
          <Card key={d.id} className="p-5 border-0 shadow-card text-center">
            <div className="relative inline-block">
              <Avatar className="h-20 w-20 mx-auto border-4 border-primary-soft">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">{d.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <Badge className="absolute -top-1 -right-1 bg-primary">{d.bloodGroup}</Badge>
            </div>
            <Link to={`/donors/${d.id}`} className="block mt-3 font-bold hover:text-primary">{d.name}</Link>
            <div className="text-xs text-muted-foreground mt-1">{d.distance}</div>
            <div className="flex items-center justify-center gap-1 text-xs mt-2">
              <span className={`h-2 w-2 rounded-full ${d.available ? "bg-success" : "bg-muted-foreground"}`} />
              {d.available ? t("donors.available") : t("donors.unavailable")}
            </div>
            <div className="flex justify-center gap-2 mt-3">
              <Button size="icon" variant="outline" className="h-8 w-8"><Phone className="h-3 w-3" /></Button>
              <Button size="icon" variant="outline" className="h-8 w-8"><MessageCircle className="h-3 w-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};

export default Donors;
