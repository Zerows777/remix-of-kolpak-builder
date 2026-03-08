import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const projects = [
  { img: portfolio1, title: "Медный колпак", category: "КРОВЛЯ", desc: "Шатровый колпак из меди с патиной" },
  { img: portfolio2, title: "Кухонная вытяжка", category: "ИНТЕРЬЕР", desc: "Купольная вытяжка из меди" },
  { img: portfolio3, title: "Забор ранчо", category: "ОГРАЖДЕНИЯ", desc: "3 ряда лаг с откатными воротами" },
  { img: portfolio4, title: "Доборные элементы", category: "КРОВЛЯ", desc: "Комплект коньков и ендов" },
];

const PortfolioPreview = () => {
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
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group border-brutal-thin bg-card hover-lift overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <span className="text-[10px] font-mono font-bold text-accent tracking-[0.2em]">{p.category}</span>
                <h3 className="text-base font-bold text-foreground uppercase mt-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">{p.desc}</p>
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
