import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Plus, Trash2, ImageIcon, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/axios";

type GalleryItem = {
  _id: string;
  title: string;
  description?: string;
  mediaType: "photo" | "video";
  url: string;
  youtubeId?: string;
};

const emptyForm = {
  title: "",
  description: "",
  mediaType: "photo" as "photo" | "video",
  url: "",
  youtubeId: "",
};

const AdminGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get("/gallery");
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Unable to load gallery", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setIsNew(true);
    setEditItem(null);
    setDialogOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setForm({
      title: item.title,
      description: item.description || "",
      mediaType: item.mediaType,
      url: item.url,
      youtubeId: item.youtubeId || "",
    });
    setIsNew(false);
    setEditItem(item);
    setDialogOpen(true);
  };

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      toast({ title: "Title and URL are required", variant: "destructive" });
      return;
    }

    try {
      if (isNew) {
        await api.post("/gallery", form);
        toast({ title: "Gallery item added" });
      } else if (editItem) {
        await api.put(`/gallery/${editItem._id}`, form);
        toast({ title: "Gallery item updated" });
      }
      setDialogOpen(false);
      fetchGallery();
    } catch (error: any) {
      toast({ title: "Save failed", description: error.response?.data?.message || "Unable to save gallery item", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/gallery/${deleteId}`);
      toast({ title: "Gallery item deleted" });
      setDeleteId(null);
      fetchGallery();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.response?.data?.message || "Unable to delete gallery item", variant: "destructive" });
    }
  };

  return (
    <AppLayout title="Gallery Management">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Add photos or videos and manage gallery items for the home page.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Photo / Video</Button>
      </div>

      <Card className="p-6 border-0 shadow-card">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Loading gallery...</div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No gallery items yet. Add a photo or video to display on home page.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item._id} className="rounded-3xl overflow-hidden border border-border bg-background shadow-sm">
                <div className="relative bg-black/5">
                  {item.mediaType === "photo" ? (
                    <img src={item.url} alt={item.title} className="h-56 w-full object-cover" />
                  ) : item.youtubeId ? (
                    <iframe
                      className="h-56 w-full"
                      src={`https://www.youtube.com/embed/${item.youtubeId}`}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video className="h-56 w-full object-cover" controls src={item.url} />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-primary font-bold">{item.mediaType}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(item._id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description || "No description provided."}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add Gallery Item" : "Edit Gallery Item"}</DialogTitle>
            <DialogDescription>{isNew ? "Upload a new photo or video for the home page." : "Update the existing gallery item."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setField("title", e.target.value)} className="mt-2" placeholder="Camp photo title" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setField("description", e.target.value)} className="mt-2" placeholder="Add a short description" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Media Type</Label>
                <Select value={form.mediaType} onValueChange={(value) => setField("mediaType", value as "photo" | "video") }>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>URL</Label>
                <Input value={form.url} onChange={(e) => setField("url", e.target.value)} className="mt-2" placeholder="https://..." />
              </div>
            </div>
            {form.mediaType === "video" && (
              <div>
                <Label>YouTube ID (optional)</Label>
                <Input value={form.youtubeId} onChange={(e) => setField("youtubeId", e.target.value)} className="mt-2" placeholder="e.g. dQw4w9WgXcQ" />
                <p className="text-xs text-muted-foreground mt-2">If provided, YouTube ID will be used to embed the video. Otherwise, the URL is treated as direct video source.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{isNew ? "Create Item" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete gallery item?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone and the media will be removed from the home page.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default AdminGallery;
