import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { X, ImagePlus, Star } from "lucide-react";
import { isVideoFile, isVideoUrl } from "@/lib/media";

const projectSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
  category: z.string().min(1, "Категория обязательна"),
  location: z.string().optional(),
  tags: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

interface ExistingImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number | null;
}

const MAX_IMAGES = 5;

const EditProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showOnHome, setShowOnHome] = useState(false);

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", description: "", category: "", location: "", tags: "" },
  });

  useEffect(() => {
    if (!id) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadAll = async () => {
    try {
      setInitialLoading(true);
      const [{ data: cats }, { data: project }, { data: images }] = await Promise.all([
        supabase.from("portfolio_categories").select("*").order("sort_order", { ascending: true }),
        supabase.from("portfolio_projects").select("*").eq("id", id!).maybeSingle(),
        supabase.from("portfolio_images").select("*").eq("project_id", id!).order("sort_order", { ascending: true }),
      ]);

      if (cats) setCategories(cats);
      if (!project) {
        toast({ title: "Проект не найден", variant: "destructive" });
        navigate("/portfolio");
        return;
      }

      form.reset({
        title: project.title,
        description: project.description,
        category: project.category,
        location: project.location || "",
        tags: (project.tags || []).join(", "),
      });
      setShowOnHome(!!project.show_on_home);
      setExistingImages(images || []);
    } catch (e) {
      console.error(e);
      toast({ title: "Ошибка загрузки", variant: "destructive" });
    } finally {
      setInitialLoading(false);
    }
  };

  const totalImagesCount = existingImages.length + newFiles.length;

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (totalImagesCount + files.length > MAX_IMAGES) {
      toast({
        title: "Ограничение",
        description: `Максимум ${MAX_IMAGES} фотографий на проект`,
        variant: "destructive",
      });
      return;
    }
    const updatedFiles = [...newFiles, ...files];
    setNewFiles(updatedFiles);
    newPreviews.forEach((url) => URL.revokeObjectURL(url));
    setNewPreviews(updatedFiles.map((f) => URL.createObjectURL(f)));
    e.target.value = "";
  };

  const removeExistingImage = (imgId: string) => {
    setRemovedImageIds((prev) => [...prev, imgId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const removeNewFile = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles(newFiles.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (existingImages.length + newFiles.length === 0) {
      toast({ title: "Ошибка", description: "Должна быть хотя бы одна фотография", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("portfolio").upload(fileName, file);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(fileName);
        uploadedUrls.push(urlData.publicUrl);
      }

      if (removedImageIds.length > 0) {
        await supabase.from("portfolio_images").delete().in("id", removedImageIds);
      }

      if (uploadedUrls.length > 0) {
        const startSort = existingImages.length;
        const inserts = uploadedUrls.map((url, idx) => ({
          project_id: id!,
          image_url: url,
          alt_text: `${data.title} - фото ${startSort + idx + 1}`,
          sort_order: startSort + idx,
        }));
        const { error: imgErr } = await supabase.from("portfolio_images").insert(inserts);
        if (imgErr) throw imgErr;
      }

      const coverImage = existingImages[0]?.image_url ?? uploadedUrls[0] ?? null;

      const tagsArray = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
        : [];

      const { error: updErr } = await supabase
        .from("portfolio_projects")
        .update({
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location || null,
          cover_image: coverImage,
          tags: tagsArray,
          show_on_home: showOnHome,
        })
        .eq("id", id!);

      if (updErr) throw updErr;

      toast({ title: "Сохранено", description: "Проект успешно обновлён" });
      navigate("/portfolio");
    } catch (e) {
      console.error("Error updating project:", e);
      toast({ title: "Ошибка", description: "Не удалось сохранить изменения", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-20 flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Загрузка проекта...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">Редактировать проект</CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название проекта *</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите название проекта" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Подробное описание проекта" className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Категория *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Местоположение</FormLabel>
                        <FormControl>
                          <Input placeholder="Город (опционально)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Теги</FormLabel>
                        <FormControl>
                          <Input placeholder="Металл, Профнастил (через запятую)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => setShowOnHome((v) => !v)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-md border transition-colors ${
                      showOnHome
                        ? "border-accent bg-accent/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-accent/40"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Star className={`w-4 h-4 ${showOnHome ? "fill-accent text-accent" : ""}`} />
                      Показывать на главной странице
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider">
                      {showOnHome ? "Вкл" : "Выкл"}
                    </span>
                  </button>

                  <div className="space-y-2">
                    <FormLabel>Фото и видео проекта * (до {MAX_IMAGES} шт.)</FormLabel>

                    {(existingImages.length > 0 || newPreviews.length > 0) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {existingImages.map((img, index) => {
                          const isVideo = isVideoUrl(img.image_url);
                          return (
                            <div
                              key={img.id}
                              className="relative aspect-[4/3] rounded-md overflow-hidden border border-border bg-muted"
                            >
                              {isVideo ? (
                                <video src={img.image_url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                              ) : (
                                <img
                                  src={img.image_url}
                                  alt={img.alt_text || ""}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => removeExistingImage(img.id)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              {isVideo && (
                                <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">▶ Видео</span>
                              )}
                              {index === 0 && (
                                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded">
                                  Обложка
                                </span>
                              )}
                            </div>
                          );
                        })}
                        {newPreviews.map((preview, index) => {
                          const overallIndex = existingImages.length + index;
                          const file = newFiles[index];
                          const isVideo = file ? isVideoFile(file) : false;
                          return (
                            <div
                              key={`new-${index}`}
                              className="relative aspect-[4/3] rounded-md overflow-hidden border border-accent/40 bg-muted"
                            >
                              {isVideo ? (
                                <video src={preview} className="w-full h-full object-cover" muted playsInline />
                              ) : (
                                <img src={preview} alt={`Новое фото ${index + 1}`} className="w-full h-full object-cover" />
                              )}
                              <button
                                type="button"
                                onClick={() => removeNewFile(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              {overallIndex === 0 && (
                                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded">
                                  Обложка
                                </span>
                              )}
                              <span className="absolute top-1 left-1 bg-accent text-accent-foreground text-[10px] px-2 py-0.5 rounded">
                                {isVideo ? "▶ Новое видео" : "Новое"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {totalImagesCount < MAX_IMAGES && (
                      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors">
                        <ImagePlus className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Добавить фото или видео ({totalImagesCount}/{MAX_IMAGES})
                        </span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          className="hidden"
                          onChange={handleFilesChange}
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/portfolio")}
                      className="flex-1"
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProjectPage;
