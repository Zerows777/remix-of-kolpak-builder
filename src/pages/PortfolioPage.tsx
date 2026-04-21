import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Settings, X, Pencil, Trash2, ChevronLeft, ChevronRight, LogOut, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  location?: string;
  cover_image?: string;
  is_published: boolean;
  show_on_home: boolean;
  sort_order: number;
  created_at: string;
}

interface ProjectImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number | null;
}

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

const PortfolioPage = () => {
  const { isAdmin, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("Все");
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editCatName, setEditCatName] = useState("");
  // Lightbox state
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const [lightboxImages, setLightboxImages] = useState<ProjectImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filtered = activeFilter === "Все" ? allProjects : allProjects.filter(p => p.category === activeFilter);

  useEffect(() => {
    loadProjects();
    loadCategories();
  }, []);

  // Apply category filter from URL query (?category=...)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveFilter(cat);
  }, [searchParams]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from('portfolio_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setCategories(data);
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    const { error } = await supabase
      .from('portfolio_categories')
      .insert({ name: newCatName.trim(), sort_order: categories.length + 1 });
    if (error) {
      toast({ title: "Ошибка", description: "Категория с таким названием уже существует", variant: "destructive" });
    } else {
      setNewCatName("");
      loadCategories();
      toast({ title: "Категория добавлена" });
    }
  };

  const updateCategory = async () => {
    if (!editingCat || !editCatName.trim()) return;
    // Update category name
    const { error } = await supabase
      .from('portfolio_categories')
      .update({ name: editCatName.trim() })
      .eq('id', editingCat.id);
    if (error) {
      toast({ title: "Ошибка", description: "Не удалось обновить", variant: "destructive" });
    } else {
      // Also update all projects that use the old category name
      await supabase
        .from('portfolio_projects')
        .update({ category: editCatName.trim() })
        .eq('category', editingCat.name);
      setEditingCat(null);
      setEditCatName("");
      loadCategories();
      loadProjects();
      toast({ title: "Категория обновлена" });
    }
  };

  const deleteCategory = async (cat: Category) => {
    const projectsInCat = allProjects.filter(p => p.category === cat.name);
    if (projectsInCat.length > 0) {
      toast({ title: "Ошибка", description: `В категории "${cat.name}" есть проекты. Сначала удалите или переместите их.`, variant: "destructive" });
      return;
    }
    await supabase.from('portfolio_categories').delete().eq('id', cat.id);
    loadCategories();
    if (activeFilter === cat.name) setActiveFilter("Все");
    toast({ title: "Категория удалена" });
  };

  const deleteProject = async (project: Project) => {
    if (!confirm(`Удалить проект "${project.title}"?`)) return;
    // Delete images first
    await supabase.from('portfolio_images').delete().eq('project_id', project.id);
    await supabase.from('portfolio_projects').delete().eq('id', project.id);
    loadProjects();
    toast({ title: "Проект удалён" });
  };

  const toggleHome = async (project: Project) => {
    const next = !project.show_on_home;
    const { error } = await supabase
      .from('portfolio_projects')
      .update({ show_on_home: next })
      .eq('id', project.id);
    if (error) {
      toast({ title: "Ошибка", description: "Не удалось обновить", variant: "destructive" });
      return;
    }
    setAllProjects(prev => prev.map(p => p.id === project.id ? { ...p, show_on_home: next } : p));
    toast({ title: next ? "Добавлено на главную" : "Убрано с главной" });
  };

  const openLightbox = async (project: Project) => {
    setLightboxProject(project);
    setLightboxIndex(0);
    const { data } = await supabase
      .from('portfolio_images')
      .select('*')
      .eq('project_id', project.id)
      .order('sort_order', { ascending: true });
    if (data && data.length > 0) {
      setLightboxImages(data);
    } else if (project.cover_image) {
      setLightboxImages([{ id: '0', image_url: project.cover_image, alt_text: project.title, sort_order: 0 }]);
    } else {
      setLightboxImages([]);
    }
  };

  const closeLightbox = () => {
    setLightboxProject(null);
    setLightboxImages([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-20 lg:pt-24 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка проектов...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filterList = ["Все", ...categories.map(c => c.name)];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 lg:pt-24">
        <section className="bg-primary noise-texture py-16 border-b-4 border-accent">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ Портфолио ]</span>
                <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mt-2 tracking-tighter">Работы</h1>
                <p className="text-primary-foreground/40 text-sm font-mono mt-3">Реализованные проекты по всей Беларуси</p>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => signOut()}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                  <Dialog open={showCatManager} onOpenChange={setShowCatManager}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Управление категориями</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            placeholder="Новая категория"
                            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                          />
                          <Button onClick={addCategory} size="sm">Добавить</Button>
                        </div>
                        <div className="space-y-2">
                          {categories.map(cat => (
                            <div key={cat.id} className="flex items-center gap-2 p-2 rounded border border-border">
                              {editingCat?.id === cat.id ? (
                                <>
                                  <Input
                                    value={editCatName}
                                    onChange={(e) => setEditCatName(e.target.value)}
                                    className="flex-1 h-8"
                                    onKeyDown={(e) => e.key === 'Enter' && updateCategory()}
                                  />
                                  <Button size="sm" variant="ghost" onClick={updateCategory}>✓</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingCat(null)}>✗</Button>
                                </>
                              ) : (
                                <>
                                  <span className="flex-1 text-sm font-medium">{cat.name}</span>
                                  <Button size="sm" variant="ghost" onClick={() => { setEditingCat(cat); setEditCatName(cat.name); }}>
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => deleteCategory(cat)} className="text-destructive hover:text-destructive">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Link to="/add-project">
                    <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить проект
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-4 border-b-2 border-foreground">
          <div className="container mx-auto px-4 flex gap-1 flex-wrap">
            {filterList.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="py-12 stripe-bg">
          <div className="container mx-auto px-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-bold text-foreground mb-2">Проекты не найдены</h3>
                <p className="text-muted-foreground">В данной категории пока нет проектов</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="group bg-card border-brutal-thin hover-lift overflow-hidden relative">
                    <div className="aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => openLightbox(p)}>
                      {p.cover_image ? (
                        <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">Нет изображения</span>
                        </div>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleHome(p)}
                          title={p.show_on_home ? "Убрать с главной" : "Показывать на главной"}
                          className={`rounded-full p-1.5 ${p.show_on_home ? 'bg-accent text-accent-foreground' : 'bg-background/90 text-foreground hover:bg-accent hover:text-accent-foreground'}`}
                        >
                          <Star className={`w-3 h-3 ${p.show_on_home ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => deleteProject(p)}
                          className="bg-destructive text-destructive-foreground rounded-full p-1.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-accent text-accent-foreground uppercase tracking-wider">{p.category}</span>
                        {p.location && <span className="text-[10px] text-muted-foreground font-mono">{p.location}</span>}
                      </div>
                      <h3 className="text-base font-bold text-foreground uppercase tracking-tight">{p.title}</h3>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{p.description}</p>
                      {p.tags && p.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 text-[9px] bg-muted text-muted-foreground rounded uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxProject && lightboxImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X className="w-8 h-8" />
            </button>

            <div className="absolute top-4 left-4 text-white">
              <h3 className="text-lg font-bold">{lightboxProject.title}</h3>
              <p className="text-sm text-white/60">{lightboxIndex + 1} / {lightboxImages.length}</p>
            </div>

            {lightboxImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i > 0 ? i - 1 : lightboxImages.length - 1); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i < lightboxImages.length - 1 ? i + 1 : 0); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <img
              src={lightboxImages[lightboxIndex]?.image_url}
              alt={lightboxImages[lightboxIndex]?.alt_text || ''}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {lightboxImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {lightboxImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === lightboxIndex ? 'bg-white' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PortfolioPage;