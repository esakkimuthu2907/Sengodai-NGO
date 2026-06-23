import { PublicHeader, PublicFooter } from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Users, Droplet, HeartPulse, Building2, ImageIcon, PlayCircle, AlertTriangle, Phone, CheckCircle2 } from "lucide-react";
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

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Landing = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Emergency form state
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: '',
    age: '',
    bloodGroup: '',
    units: '1',
    hospitalName: '',
    location: '',
    contactPhone: '',
    urgency: 'High',
  });
  const [emergencySubmitting, setEmergencySubmitting] = useState(false);
  const [emergencySuccess, setEmergencySuccess] = useState<string | null>(null);
  const [emergencyError, setEmergencyError] = useState<string | null>(null);

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

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmergencyError(null);
    setEmergencySuccess(null);

    const { patientName, age, bloodGroup, units, hospitalName, location, contactPhone } = emergencyForm;
    if (!patientName || !bloodGroup || !units || !hospitalName || !location || !contactPhone) {
      setEmergencyError('Please fill all required fields.');
      return;
    }

    setEmergencySubmitting(true);
    try {
      const res = await api.post('/requests/emergency', emergencyForm);
      if (res.data.success) {
        setEmergencySuccess(`✅ Request #${res.data.requestId} submitted! Admins notified via WhatsApp & SMS.`);
        setEmergencyForm({ patientName: '', age: '', bloodGroup: '', units: '1', hospitalName: '', location: '', contactPhone: '', urgency: 'High' });
      } else {
        setEmergencyError(res.data.message || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      setEmergencyError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setEmergencySubmitting(false);
    }
  };

  const setField = (key: keyof typeof emergencyForm, value: string) =>
    setEmergencyForm(f => ({ ...f, [key]: value }));

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

        {/* 🚨 Emergency Blood Request Section */}
        <section className="container py-16">
          <div className="rounded-2xl border-2 border-red-500/40 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-red-600 dark:text-red-400">Emergency Blood Request</h2>
                <p className="text-sm text-muted-foreground">No login needed — Admins are instantly notified via WhatsApp & SMS</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-green-600" />
              <span>Alerts sent to <strong>+91 7904577032</strong> & <strong>+91 9894955401</strong> immediately</span>
            </div>

            {emergencySuccess && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 p-4 text-green-800 dark:text-green-300 text-sm">
                <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                <span>{emergencySuccess}</span>
              </div>
            )}

            {emergencyError && (
              <div className="mb-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-3 text-red-700 dark:text-red-400 text-sm">
                {emergencyError}
              </div>
            )}

            <form onSubmit={handleEmergencySubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-semibold">Patient Name <span className="text-red-500">*</span></Label>
                <Input
                  className="mt-1"
                  placeholder="e.g. Ramesh Kumar"
                  value={emergencyForm.patientName}
                  onChange={e => setField('patientName', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Patient Age</Label>
                <Input
                  type="number"
                  className="mt-1"
                  placeholder="e.g. 35"
                  value={emergencyForm.age}
                  onChange={e => setField('age', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Blood Group <span className="text-red-500">*</span></Label>
                <Select value={emergencyForm.bloodGroup} onValueChange={v => setField('bloodGroup', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select blood group" /></SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold">Units Needed <span className="text-red-500">*</span></Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  className="mt-1"
                  placeholder="2"
                  value={emergencyForm.units}
                  onChange={e => setField('units', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Hospital Name <span className="text-red-500">*</span></Label>
                <Input
                  className="mt-1"
                  placeholder="e.g. Government Hospital"
                  value={emergencyForm.hospitalName}
                  onChange={e => setField('hospitalName', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Location / City <span className="text-red-500">*</span></Label>
                <Input
                  className="mt-1"
                  placeholder="e.g. Tirunelveli"
                  value={emergencyForm.location}
                  onChange={e => setField('location', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Contact Phone <span className="text-red-500">*</span></Label>
                <Input
                  className="mt-1"
                  placeholder="e.g. 9876543210"
                  value={emergencyForm.contactPhone}
                  onChange={e => setField('contactPhone', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Urgency Level</Label>
                <Select value={emergencyForm.urgency} onValueChange={v => setField('urgency', v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Low','Medium','High','Critical'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 lg:col-span-2 flex items-end">
                <Button
                  type="submit"
                  disabled={emergencySubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-base py-6 shadow-lg"
                  size="lg"
                >
                  {emergencySubmitting ? (
                    <span className="flex items-center gap-2"><span className="animate-spin">⏳</span> Submitting...</span>
                  ) : (
                    <span className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Send Emergency Request</span>
                  )}
                </Button>
              </div>
            </form>
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
            <Tabs defaultValue="photos" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="photos" className="font-semibold flex gap-2 items-center">
                    <ImageIcon className="h-4 w-4" /> Photos
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="font-semibold flex gap-2 items-center">
                    <PlayCircle className="h-4 w-4" /> Videos
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="photos" className="mt-0">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {galleryItems.filter(item => item.mediaType === 'photo').length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">No photos available.</div>
                  ) : (
                    galleryItems.filter(item => item.mediaType === 'photo').map((item) => (
                      <Card 
                        key={item._id} 
                        className="overflow-hidden border-0 shadow-card cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => setSelectedImage(item)}
                      >
                        <div className="relative bg-black/5 aspect-square">
                          <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold truncate">{item.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description || 'No description available.'}</p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="mt-0">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {galleryItems.filter(item => item.mediaType === 'video').length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">No videos available.</div>
                  ) : (
                    galleryItems.filter(item => item.mediaType === 'video').map((item) => (
                      <Card key={item._id} className="overflow-hidden border-0 shadow-card">
                        <div className="relative bg-black/5 aspect-video w-full">
                          {item.youtubeId ? (
                            <iframe
                              className="h-full w-full absolute inset-0"
                              src={`https://www.youtube.com/embed/${item.youtubeId}`}
                              title={item.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video className="h-full w-full object-cover absolute inset-0" controls src={item.url} />
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold truncate">{item.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description || 'No description available.'}</p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </section>
      </main>
      <PublicFooter />

      {/* Full Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-0">
          <DialogTitle className="sr-only">{selectedImage?.title}</DialogTitle>
          <DialogDescription className="sr-only">{selectedImage?.description}</DialogDescription>
          {selectedImage && (
            <div className="relative flex flex-col items-center justify-center w-full h-full max-h-[90vh]">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="w-full h-full object-contain max-h-[80vh]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-sm mt-1 text-white/80">{selectedImage.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
