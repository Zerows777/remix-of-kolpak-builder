import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isVideoUrl } from "@/lib/media";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

interface HomeProject {
  id: string;
  title: string;
  description: string;
  category: string;
  cover_image: string | null;
}

const fallbackProjects = [
  { id: "f1", cover_image: portfolio1, title: "Медный колпак", category: "КРОВЛЯ", description: "Шатровый колпак из меди с патиной" },
  { id: "f2", cover_image: portfolio2, title: "Кухонная вытяжка", category: "ИНТЕРЬЕР", description: "Купольная вытяжка из меди" },
  { id: "f3", cover_image: portfolio3, title: "Забор ранчо", category: "ОГРАЖДЕНИЯ", description: "3 ряда лаг с откатными воротами" },
  { id: "f4", cover_image: portfolio4, title: "Доборные элементы", category: "КРОВЛЯ", description: "Комплект коньков и ендов" },
];

const PortfolioPreview = () => {
  const [projects, setProjects] = useState<HomeProject[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("portfolio_projects")
        .select("id, title, description, category, cover_image")
        .eq("is_published", true)
        .eq("show_on_home", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(8);
      setProjects((data as HomeProject[]) || []);
      setLoaded(true);
    })();
  }, []);

  // Show DB-selected projects when present, otherwise fallback to demo projects
  const display = loaded && projects.length > 0 ? projects : fallbackProjects;

  return (
    <section className="py-20 bg-warm-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ 03 ]</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 tracking-tighter">
              Работы
            </h2>
            <div className="w-20 h-1 bg-accent mt-4" />
          </div>
          <Link
            to="/portfolio"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider hover:text-accent transition-colors"
          >
            Все проекты <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {display.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group border-brutal-thin bg-card hover-lift overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {p.cover_image ? (
                  isVideoUrl(p.cover_image) ? (
                    <video
                      src={p.cover_image}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={p.cover_image}
                      alt={p.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    Нет изображения
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="text-[10px] font-mono font-bold text-accent tracking-[0.2em] uppercase">{p.category}</span>
                <h3 className="text-base font-bold text-foreground uppercase mt-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1 line-clamp-2">{p.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-bold text-accent uppercase">
            Все проекты <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
