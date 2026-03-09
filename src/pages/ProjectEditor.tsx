import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  tags: string;
  location: string;
  is_published: boolean;
  sort_order: number;
}

interface ProjectImage {
  id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
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
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const form = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      description: '',
      category: 'Кровля',
      tags: '',
      location: '',
      is_published: false,
      sort_order: 0,
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
        tags: project.tags?.join(', ') || '',
        location: project.location || '',
        is_published: project.is_published,
        sort_order: project.sort_order,
      });

      setCoverImageUrl(project.cover_image || '');

      // Load gallery images
      const { data: images } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order');

      setGalleryImages(images || []);
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

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadingFiles(files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ProjectImage = {
          id: Math.random().toString(36),
          image_url: e.target?.result as string,
          sort_order: galleryImages.length,
        };
        setGalleryImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (imageId: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
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
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        location: data.location || null,
        cover_image: coverImagePublicUrl || null,
        is_published: data.is_published,
        sort_order: data.sort_order,
      };

      let projectId = id;

      if (isNew) {
        const { data: newProject, error } = await supabase
          .from('portfolio_projects')
          .insert(projectData)
          .select()
          .single();

        if (error) throw error;
        projectId = newProject.id;
      } else {
        const { error } = await supabase
          .from('portfolio_projects')
          .update(projectData)
          .eq('id', id);

        if (error) throw error;
      }

      // Upload and save gallery images
      if (uploadingFiles.length > 0 && projectId) {
        const uploadPromises = uploadingFiles.map(async (file, index) => {
          const imageUrl = await uploadImage(file);
          return {
            project_id: projectId,
            image_url: imageUrl,
            sort_order: galleryImages.length + index,
          };
        });

        const imageRecords = await Promise.all(uploadPromises);

        const { error: imagesError } = await supabase
          .from('portfolio_images')
          .insert(imageRecords);

        if (imagesError) throw imagesError;
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
      {/* Header */}
      <header className="bg-primary border-b-4 border-accent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin')}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground tracking-tighter uppercase">
                {isNew ? 'Новый проект' : 'Редактирование проекта'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Main Info */}
              <div className="space-y-6">
                <Card className="border-brutal-thin">
                  <CardHeader>
                    <CardTitle className="text-lg uppercase">Основная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Название проекта</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-brutal-thin" />
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
                            <Textarea {...field} className="border-brutal-thin min-h-[100px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Категория</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-brutal-thin"
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
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Местоположение</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-brutal-thin" placeholder="г. Минск" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Теги (через запятую)</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-brutal-thin" placeholder="медь, колпак, кровля" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sort_order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Порядок сортировки</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                className="border-brutal-thin"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="is_published"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-brutal-thin p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Опубликовать</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Images */}
              <div className="space-y-6">
                {/* Cover Image */}
                <Card className="border-brutal-thin">
                  <CardHeader>
                    <CardTitle className="text-lg uppercase">Обложка</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {coverImageUrl ? (
                      <div className="relative group">
                        <img
                          src={coverImageUrl}
                          alt="Cover"
                          className="w-full aspect-[4/3] object-cover rounded border-brutal-thin"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setCoverImageUrl('');
                            setCoverImageFile(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-muted-foreground rounded cursor-pointer hover:border-accent transition-colors">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Загрузить обложку</span>
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

                {/* Gallery Images */}
                <Card className="border-brutal-thin">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg uppercase">Галерея</CardTitle>
                      <label>
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить фото
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {galleryImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {galleryImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.image_url}
                              alt=""
                              className="w-full aspect-square object-cover rounded border-brutal-thin"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeGalleryImage(image.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3" />
                        <p className="text-sm">Нет изображений в галерее</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="font-bold uppercase tracking-wider shadow-brutal-sm hover:shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                {saving ? (
                  'Сохранение...'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить проект
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default ProjectEditor;