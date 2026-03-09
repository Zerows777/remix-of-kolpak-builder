import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const projectSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
  category: z.string().min(1, "Категория обязательна"),
  location: z.string().optional(),
  tags: z.string().optional(),
  coverImage: z.any().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const AddProjectPage = () => {
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setLoading(true);

      let coverImageUrl = null;

      // Загружаем обложку если выбрана
      if (data.coverImage && data.coverImage[0]) {
        const file = data.coverImage[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName);
        
        coverImageUrl = urlData.publicUrl;
      }

      // Обрабатываем теги
      const tagsArray = data.tags ? 
        data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : 
        [];

      // Создаем проект
      const { error } = await supabase
        .from('portfolio_projects')
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location || null,
          cover_image: coverImageUrl,
          tags: tagsArray,
          is_published: true,
        });

      if (error) {
        throw error;
      }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
                            placeholder="Подробное описание проекта, его особенности и технические детали"
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
                        <FormControl>
                          <Input placeholder="Например: Веб-разработка, Дизайн, Мобильные приложения" {...field} />
                        </FormControl>
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
                          <Input placeholder="Город, страна (опционально)" {...field} />
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
                          <Input placeholder="React, TypeScript, Node.js (через запятую)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Обложка проекта</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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