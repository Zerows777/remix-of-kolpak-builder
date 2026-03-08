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
  { img: portfolio2, title: "Купольная вытяжка из меди", cat: "Интерьер", location: "г. Минск", desc: "Островная кухонная вытяжка диаметром 900мм" },
  { img: portfolio3, title: "Забор ранчо с воротами", cat: "Ограждения", location: "Брестская обл.", desc: "Забор ранчо 3 ряда, откатные ворота, калитка" },
  { img: portfolio4, title: "Доборные элементы кровли", cat: "Кровля", location: "Гродненская обл.", desc: "Полный комплект коньков, ендов, планок примыкания" },
  { img: portfolio1, title: "Колпак с патиной", cat: "Кровля", location: "Могилёвская обл.", desc: "Двухскатный колпак, искусственная зелёная патина" },
  { img: portfolio2, title: "Вытяжка для барбекю", cat: "Интерьер", location: "Минская обл.", desc: "Стационарная медная вытяжка для уличной зоны" },
];

const filters = ["Все", "Кровля", "Интерьер", "Ограждения"];

const PortfolioPage = () => {
  const [activeFilter, setActiveFilter] = useState("Все");

  const filtered = activeFilter === "Все" ? allProjects : allProjects.filter(p => p.cat === activeFilter);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 lg:pt-24">
        <section className="bg-gradient-graphite metal-texture py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-3">Портфолио</h1>
            <p className="text-primary-foreground/50 text-lg">Реализованные проекты по всей Беларуси</p>
          </div>
        </section>

        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 flex gap-3">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === f ? "bg-copper text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-copper/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs font-medium bg-copper/10 text-copper rounded">{p.cat}</span>
                      <span className="text-xs text-muted-foreground">{p.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
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
