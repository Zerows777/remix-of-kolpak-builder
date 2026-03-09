import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

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

const filters = ["Все", "Кровля", "Интерьер", "Ограждения", "Водостоки", "Декор"];

const PortfolioPage = () => {
  const [activeFilter, setActiveFilter] = useState("Все");
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const filtered = activeFilter === "Все" ? allProjects : allProjects.filter(p => p.category === activeFilter);

  useEffect(() => {
    loadProjects();
  }, []);

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

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 lg:pt-24">
        <section className="bg-primary noise-texture py-16 border-b-4 border-accent">
          <div className="container mx-auto px-4">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ Портфолио ]</span>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mt-2 tracking-tighter">Работы</h1>
            <p className="text-primary-foreground/40 text-sm font-mono mt-3">Реализованные проекты по всей Беларуси</p>
          </div>
        </section>

        <section className="py-4 border-b-2 border-foreground">
          <div className="container mx-auto px-4 flex gap-1">
            {filters.map(f => (
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
                    className="group bg-card border-brutal-thin hover-lift overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      {p.cover_image ? (
                        <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">Нет изображения</span>
                        </div>
                      )}
                    </div>
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
      <Footer />
    </div>
  );
};

export default PortfolioPage;
