import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const projects = [
  { img: portfolio1, title: "Медный колпак", category: "Кровля", desc: "Шатровый колпак из меди с патиной" },
  { img: portfolio2, title: "Кухонная вытяжка", category: "Интерьер", desc: "Купольная вытяжка из меди" },
  { img: portfolio3, title: "Забор ранчо", category: "Ограждения", desc: "Забор ранчо 3 ряда с воротами" },
  { img: portfolio4, title: "Доборные элементы", category: "Кровля", desc: "Комплект коньков и ендов" },
];

const PortfolioPreview = () => {
  return (
    <section className="py-20 bg-warm-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Наши работы
            </h2>
            <p className="text-muted-foreground">Реализованные проекты по всей Беларуси</p>
          </div>
          <Link
            to="/portfolio"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-copper hover:text-copper-dark transition-colors"
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
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer"
            >
              <img
                src={p.img}
                alt={p.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-xs font-medium text-copper tracking-wide uppercase">{p.category}</span>
                <h3 className="text-lg font-bold text-primary-foreground mt-1">{p.title}</h3>
                <p className="text-sm text-primary-foreground/60 mt-1">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-copper"
          >
            Все проекты <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
