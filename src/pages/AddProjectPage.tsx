import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { X, ImagePlus } from "lucide-react";

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

const AddProjectPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const navigate = useNavigate();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      tags: "",
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('portfolio_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setCategories(data);
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalFiles = selectedFiles.length + files.length;

    if (totalFiles > 5) {
      toast({
        title: "Ограничение",
        description: "Максимум 5 фотографий на проект",
        variant: "destructive",
      });
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Generate previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews(newPreviews);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы одну фотографию",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Upload all images
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      }

      // Process tags
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // Create project with first image as cover
      const { data: project, error } = await supabase
        .from('portfolio_projects')
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location || null,
          cover_image: uploadedUrls[0],
          tags: tagsArray,
          is_published: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert all images into portfolio_images table
      const imageInserts = uploadedUrls.map((url, index) => ({
        project_id: project.id,
        image_url: url,
        alt_text: `${data.title} - фото ${index + 1}`,
        sort_order: index,
      }));

      const { error: imagesError } = await supabase
        .from('portfolio_images')
        .insert(imageInserts);

      if (imagesError) throw imagesError;

      toast({
        title: "Успех!",
        description: "Проект успешно добавлен в портфолио",
      });

      navigate('/portfolio');
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить проект. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">
                Добавить новый проект
              </CardTitle>
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
                          <Textarea
                            placeholder="Подробное описание проекта"
                            className="min-h-[120px]"
                            {...field}
                          />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(cat => (
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

                  {/* Multi-image upload */}
                  <div className="space-y-2">
                    <FormLabel>Фотографии проекта * (до 5 шт.)</FormLabel>
                    
                    {previews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {previews.map((preview, index) => (
                          <div key={index} className="relative aspect-[4/3] rounded-md overflow-hidden border border-border">
                            <img src={preview} alt={`Фото ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {index === 0 && (
                              <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded">
                                Обложка
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedFiles.length < 5 && (
                      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors">
                        <ImagePlus className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Добавить фото ({selectedFiles.length}/5)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleFilesChange}
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Добавление..." : "Добавить проект"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/portfolio')}
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

export default AddProjectPage;