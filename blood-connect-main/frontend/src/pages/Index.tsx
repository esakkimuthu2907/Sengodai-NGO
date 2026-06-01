import { PublicHeader, PublicFooter } from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, Droplet, HeartPulse, Building2, ImageIcon, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/store/auth";
import { useTranslation } from "react-i18next";
import hero from "@/assets/hero-blood.png";

type GalleryItem = {
  _id: string;
  title: string;
  description?: string;
  mediaType: 'photo' | 'video';
  url: string;
  youtubeId?: string;
};

const Landing = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const stats = [
    { icon: Users, value: "0", label: t("index.stats_donors") },
    { icon: Droplet, value: "0", label: t("index.stats_lives") },
    { icon: HeartPulse, value: "0", label: t("index.stats_requests") },
    { icon: Building2, value: "0", label: t("index.stats_camps") },
  ];

  useEffect(() => {
    const loadGallery = async () => {
      setGalleryLoading(true);
      try {
        const res = await api.get('/gallery');
        if (res.data.success) {
          setGalleryItems(res.data.data || []);
        }
      } catch (error) {
        console.error('Gallery load failed', error);
      } finally {
        setGalleryLoading(false);
      }
    };
    loadGallery();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-soft" />
          <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
            <div>
              <Badge className="bg-primary-soft text-primary border-0 mb-6 px-3 py-1">
                {t("index.hero_badge")}
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                {t("index.hero_title_1")}<br />
                <span className="text-gradient">{t("index.hero_title_2")}</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-md">
                {t("index.hero_desc")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/donors"><Button size="lg" className="px-8 shadow-glow">{t("index.find_donor")}</Button></Link>
                <Link to="/signup"><Button size="lg" variant="outline" className="px-8 border-primary text-primary hover:bg-primary-soft">{t("index.become_donor")}</Button></Link>
              </div>
            </div>
            <div className="relative">
              <img src={hero} alt="Blood donation hero" width={1024} height={1024} className="w-full max-w-lg mx-auto animate-float" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="container -mt-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="p-5 flex items-center gap-4 shadow-card border-0">
                <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Urgent + Upcoming */}
        <section className="container py-16 grid lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-card border-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary-soft flex items-center justify-center">
                  <Droplet className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold">{t("index.urgent_requests")}</h3>
              </div>
              <Link to="/blood-requests" className="text-sm text-primary font-semibold">{t("index.view_all")}</Link>
            </div>
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Droplet className="h-10 w-10 mx-auto mb-3 text-primary/30" />
              <p>{t("index.no_urgent")}</p>
              <p className="mt-1">{t("index.new_requests")}</p>
              <Link to="/signup"><Button size="sm" className="mt-4">{t("index.join_volunteer")}</Button></Link>
            </div>
          </Card>

          <Card className="p-6 shadow-card border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{t("index.upcoming_camps")}</h3>
              <Link to="/camps" className="text-sm text-primary font-semibold">{t("index.view_all")}</Link>
            </div>
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Building2 className="h-10 w-10 mx-auto mb-3 text-primary/30" />
              <p>{t("index.no_camps")}</p>
              <p className="mt-1">{t("index.camps_organized")}</p>
            </div>
          </Card>
        </section>

        {/* Photo & Video Gallery */}
        <section className="container py-16">
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-2">{t("index.photos_videos")}</div>
              <h2 className="text-3xl font-bold">{t("index.see_highlights")}</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{t("index.browse_updates")}</p>
            </div>
            {auth.currentUser?.role === 'admin' && (
              <Link to="/admin/gallery"><Button variant="outline">{t("index.manage_gallery")}</Button></Link>
            )}
          </div>

          {galleryLoading ? (
            <div className="text-center py-16 text-muted-foreground">{t("index.loading_gallery")}</div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">{t("index.no_photos")}</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {galleryItems.map((item) => (
                <Card key={item._id} className="overflow-hidden border-0 shadow-card">
                  <div className="relative bg-black/5">
                    {item.mediaType === 'photo' ? (
                      <img src={item.url} alt={item.title} className="h-64 w-full object-cover" />
                    ) : item.youtubeId ? (
                      <div className="relative aspect-video w-full">
                        <iframe
                          className="h-full w-full"
                          src={`https://www.youtube.com/embed/${item.youtubeId}`}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <video className="h-64 w-full object-cover" controls src={item.url} />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                      {item.mediaType === 'photo' ? <ImageIcon className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />} 
                      {item.mediaType}
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description || 'No description available.'}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <PublicFooter />
    </div>
  );
};

export default Landing;
