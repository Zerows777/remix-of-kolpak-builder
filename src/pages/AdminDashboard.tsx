import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, LogOut, Eye, Edit, Trash2, Image, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  location?: string;
  cover_image?: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

const AdminDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить проекты',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успех',
        description: 'Проект удален',
      });

      loadProjects();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить проект',
        variant: 'destructive',
      });
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ is_published: !isPublished })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успех',
        description: isPublished ? 'Проект скрыт' : 'Проект опубликован',
      });

      loadProjects();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус проекта',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка проектов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b-4 border-accent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-1">
                <span className="text-xl font-bold text-primary-foreground tracking-tighter uppercase">
                  Kolpak
                </span>
                <span className="text-xl font-bold text-accent">.by</span>
              </Link>
              <Badge variant="secondary" className="font-mono text-xs">
                АДМИН
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-primary-foreground/70 font-mono hidden md:block">
                {user?.email}
              </span>
              <Link to="/">
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <Eye className="w-4 h-4 mr-2" />
                  Сайт
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Управление портфолио</h1>
            <p className="text-muted-foreground">
              {projects.length} проектов · {projects.filter(p => p.is_published).length} опубликованных
            </p>
          </div>

          <Button
            onClick={() => navigate('/admin/project/new')}
            className="font-bold uppercase tracking-wider shadow-brutal-sm hover:shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить проект
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="border-brutal-thin">
            <CardContent className="text-center py-16">
              <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-bold text-foreground mb-2">Нет проектов</h3>
              <p className="text-muted-foreground mb-6">Создайте первый проект для портфолио</p>
              <Button
                onClick={() => navigate('/admin/project/new')}
                className="font-bold uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить проект
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className="border-brutal-thin hover-lift overflow-hidden">
                  {project.cover_image && (
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge 
                        variant={project.is_published ? "default" : "secondary"} 
                        className="text-xs font-mono"
                      >
                        {project.category}
                      </Badge>
                      <Badge 
                        variant={project.is_published ? "default" : "outline"}
                        className="text-xs"
                      >
                        {project.is_published ? 'Опубликован' : 'Черновик'}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-sm uppercase tracking-tight mb-2 line-clamp-2">
                      {project.title}
                    </h3>

                    <p className="text-xs text-muted-foreground font-mono mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tags.slice(0, 3).map((tag, i) => (
                          <span 
                            key={i}
                            className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-3 border-t border-muted">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/project/${project.id}`)}
                        className="flex-1 text-xs"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Редактировать
                      </Button>

                      <Button
                        size="sm"
                        variant={project.is_published ? "secondary" : "default"}
                        onClick={() => togglePublished(project.id, project.is_published)}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-xs text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие нельзя отменить. Проект будет удален навсегда.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(project.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;