import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Flame, Home, ChefHat, Fence, Wind, FileText, Layers, Grid3X3 } from "lucide-react";

const catalogCategories = [
  {
    id: "chimney", icon: Flame, title: "Колпаки и элементы дымоходов",
    desc: "Колпаки, обшивка дымоходов, колпаки с жалюзи. Сталь и медь.",
    items: ["Колпаки на дымоходы", "Обшивка дымохода", "Колпаки с жалюзи"],
  },
  {
    id: "roofing", icon: Home, title: "Доборные элементы кровли",
    desc: "Коньки, ендовы, карнизные и торцевые планки, снегозадержатели.",
    items: ["Коньковые элементы", "Ендовы", "Карнизные планки", "Торцевые планки", "Планки примыкания", "Снегозадержатели", "Капельники"],
  },
  {
    id: "copper", icon: ChefHat, title: "Изделия из меди",
    desc: "Вытяжки, обрамление каминов, элементы для бань, садовая архитектура.",
    items: ["Вытяжки для кухни", "Вытяжки для барбекю", "Обрамление каминов", "Медная кровля", "Для бань", "Садовая архитектура"],
  },
  {
    id: "fence", icon: Fence, title: "Заборы ранчо",
    desc: "Классические, с ковкой, деревянными вставками. Ворота и калитки.",
    items: ["Классический ранчо", "С ковкой", "С деревом", "Распашные ворота", "Откатные ворота", "Калитки"],
  },
  {
    id: "parapets", icon: Layers, title: "Парапеты и ограждения",
    desc: "Кровельные парапеты, ограждения, мостики.",
    items: ["Парапеты кровельные", "Снегозащитные барьеры", "Леерные ограждения", "Мостики кровельные"],
  },
  {
    id: "sandwich", icon: Grid3X3, title: "Элементы для сэндвич-панелей",
    desc: "Стыковочные планки, угловые элементы, откосы.",
    items: ["Планки стыковочные", "Угловые элементы", "Откосы", "Цокольные отливы", "Компенсационные профили"],
  },
  {
    id: "vents", icon: Wind, title: "Вентиляционные решётки",
    desc: "Наружные с жалюзи, внутренние, декоративные из меди.",
    items: ["Неподвижные жалюзи", "Регулируемые", "С сеткой", "Декоративные (медь)", "С фильтрами"],
  },
  {
    id: "custom", icon: FileText, title: "Изделия по чертежам",
    desc: "Воздуховоды, ёмкости, кожухи, лотки — любые нестандартные изделия.",
    items: ["Воздуховоды", "Ёмкости и баки", "Кожухи оборудования", "Лотки и желоба", "Нестандартные изделия"],
  },
];

const CatalogPage = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = filter ? catalogCategories.filter((c) => c.id === filter) : catalogCategories;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 lg:pt-24">
        {/* Hero */}
        <section className="bg-primary noise-texture py-16 border-b-4 border-accent">
          <div className="container mx-auto px-4">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ Каталог ]</span>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mt-2 tracking-tighter">
              Продукция
            </h1>
            <p className="text-primary-foreground/40 text-sm font-mono mt-3 max-w-lg">
              Полный спектр изделий из оцинкованной стали, стали с полимерным покрытием и меди
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 border-b-2 border-foreground sticky top-16 lg:top-20 bg-background z-40">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setFilter(null)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  !filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}
              >
                Все
              </button>
              {catalogCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(filter === cat.id ? null : cat.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    filter === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  {cat.title.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12 stripe-bg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card border-brutal-thin hover-lift"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-primary flex items-center justify-center shrink-0">
                        <cat.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-foreground uppercase tracking-tight group-hover:text-accent transition-colors">
                          {cat.title}
                        </h2>
                        <p className="text-xs text-muted-foreground font-mono mt-1">{cat.desc}</p>
                        <div className="flex flex-wrap gap-1 mt-4">
                          {cat.items.map((item) => (
                            <span key={item} className="px-2 py-1 text-[10px] font-mono font-bold bg-muted text-muted-foreground uppercase tracking-wider">
                              {item}
                            </span>
                          ))}
                        </div>
                        <Link
                          to="/calculator"
                          className="inline-block mt-5 px-4 py-2 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                        >
                          Расчёт →
                        </Link>
                      </div>
                    </div>
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

export default CatalogPage;
