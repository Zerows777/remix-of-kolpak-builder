import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const allProjects = [
  { img: portfolio1, title: "Медный колпак на дымоход", cat: "Кровля", location: "Минская обл.", desc: "Шатровый колпак из натуральной меди с искрогасителем" },
  { img: portfolio2, title: "Купольная вытяжка из меди", cat: "Интерьер", location: "г. Минск", desc: "Островная кухонная вытяжка Ø900мм" },
  { img: portfolio3, title: "Забор ранчо с воротами", cat: "Ограждения", location: "Брестская обл.", desc: "Забор ранчо 3 ряда, откатные ворота" },
  { img: portfolio4, title: "Доборные элементы кровли", cat: "Кровля", location: "Гродненская обл.", desc: "Комплект коньков, ендов, планок" },
  { img: portfolio1, title: "Колпак с патиной", cat: "Кровля", location: "Могилёвская обл.", desc: "Двухскатный, зелёная патина" },
  { img: portfolio2, title: "Вытяжка для барбекю", cat: "Интерьер", location: "Минская обл.", desc: "Стационарная медная, уличная зона" },
];

const filters = ["Все", "Кровля", "Интерьер", "Ограждения"];

const PortfolioPage = () => {
  const [activeFilter, setActiveFilter] = useState("Все");
  const filtered = activeFilter === "Все" ? allProjects : allProjects.filter(p => p.cat === activeFilter);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="group bg-card border-brutal-thin hover-lift overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-accent text-accent-foreground uppercase tracking-wider">{p.cat}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{p.location}</span>
                    </div>
                    <h3 className="text-base font-bold text-foreground uppercase tracking-tight">{p.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
