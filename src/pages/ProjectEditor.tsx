import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
}

const categories = [
  'Кровля',
  'Интерьер', 
  'Ограждения',
  'Водостоки',
  'Декор'
];

const ProjectEditor = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');

  const form = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      description: '',
      category: 'Кровля',
    },
  });

  useEffect(() => {
    if (!isNew && id) {
      loadProject(id);
    }
  }, [id, isNew]);

  const loadProject = async (projectId: string) => {
    try {
      const { data: project, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      form.reset({
        title: project.title,
        description: project.description,
        category: project.category,
      });

      setCoverImageUrl(project.cover_image || '');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить проект',
        variant: 'destructive',
      });
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('portfolio')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    
    try {
      let coverImagePublicUrl = coverImageUrl;

      // Upload cover image if new file selected
      if (coverImageFile) {
        coverImagePublicUrl = await uploadImage(coverImageFile);
      }

      const projectData = {
        title: data.title,
        description: data.description,
        category: data.category,
        cover_image: coverImagePublicUrl || null,
        is_published: true, // Всегда публикуем
        tags: [],
        location: null,
        sort_order: 0,
      };

      if (isNew) {
        const { error } = await supabase
          .from('portfolio_projects')
          .insert(projectData);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_projects')
          .update(projectData)
          .eq('id', id);

        if (error) throw error;
      }

      toast({
        title: 'Успех',
        description: isNew ? 'Проект создан' : 'Проект обновлен',
      });

      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить проект',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка проекта...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-xl font-bold">
              {isNew ? 'Новый проект' : 'Редактирование проекта'}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Информация о проекте</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название проекта</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Введите название проекта" />
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
                      <FormLabel>Категория</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
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
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[100px]" 
                          placeholder="Опишите ваш проект"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Изображение</CardTitle>
              </CardHeader>
              <CardContent>
                {coverImageUrl ? (
                  <div className="relative">
                    <img
                      src={coverImageUrl}
                      alt="Cover"
                      className="w-full aspect-[4/3] object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setCoverImageUrl('');
                        setCoverImageFile(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-muted-foreground rounded cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Загрузить изображение</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Сохранение...' : 'Сохранить проект'}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default ProjectEditor;