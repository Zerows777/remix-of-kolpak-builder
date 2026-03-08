import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Flame, Home, ChefHat, Fence, Wind, FileText, Layers, Grid3X3 } from "lucide-react";

const catalogCategories = [
  {
    id: "chimney",
    icon: Flame,
    title: "Колпаки и элементы дымоходов",
    desc: "Односкатные, двухскатные, шатровые, флюгарки. Сталь и медь.",
    items: ["Колпаки на дымоходы", "Фартуки дымоходов", "Отбойники от ската", "Обрамление прохода", "Комплекты герметизации"],
    color: "copper",
  },
  {
    id: "roofing",
    icon: Home,
    title: "Доборные элементы кровли",
    desc: "Коньки, ендовы, карнизные и торцевые планки, снегозадержатели.",
    items: ["Коньковые элементы", "Ендовы", "Карнизные планки", "Торцевые планки", "Планки примыкания", "Снегозадержатели", "Капельники и отливы"],
    color: "graphite",
  },
  {
    id: "copper",
    icon: ChefHat,
    title: "Изделия из меди",
    desc: "Вытяжки, обрамление каминов, элементы для бань, садовая архитектура.",
    items: ["Вытяжки для кухни", "Вытяжки для барбекю", "Обрамление каминов", "Медная кровля", "Комплектующие для бань", "Садовая архитектура"],
    color: "copper",
  },
  {
    id: "fence",
    icon: Fence,
    title: "Заборы ранчо",
    desc: "Классические, с ковкой, деревянными вставками. Ворота и калитки.",
    items: ["Классический ранчо", "Ранчо с ковкой", "С деревянными вставками", "Распашные ворота", "Откатные ворота", "Калитки"],
    color: "graphite",
  },
  {
    id: "parapets",
    icon: Layers,
    title: "Парапеты и ограждения",
    desc: "Кровельные парапеты, ограждения, мостики.",
    items: ["Парапеты кровельные", "Снегозащитные барьеры", "Леерные ограждения", "Мостики кровельные"],
    color: "copper",
  },
  {
    id: "sandwich",
    icon: Grid3X3,
    title: "Элементы для сэндвич-панелей",
    desc: "Стыковочные планки, угловые элементы, откосы.",
    items: ["Планки стыковочные", "Угловые элементы", "Откосы оконные", "Цокольные отливы", "Компенсационные профили"],
    color: "graphite",
  },
  {
    id: "vents",
    icon: Wind,
    title: "Вентиляционные решётки",
    desc: "Наружные с жалюзи, внутренние, декоративные из меди.",
    items: ["Неподвижные жалюзи", "Регулируемые", "С сеткой от насекомых", "Декоративные (медь)", "С фильтрами"],
    color: "copper",
  },
  {
    id: "custom",
    icon: FileText,
    title: "Изделия по чертежам",
    desc: "Воздуховоды, ёмкости, кожухи, лотки — любые нестандартные изделия.",
    items: ["Воздуховоды", "Ёмкости и баки", "Кожухи оборудования", "Лотки и желоба", "Нестандартные изделия"],
    color: "graphite",
  },
];

const CatalogPage = () => {
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? catalogCategories.filter((c) => c.id === filter)
    : catalogCategories;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 lg:pt-24">
        <section className="bg-gradient-graphite metal-texture py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
              Каталог продукции
            </h1>
            <p className="text-primary-foreground/50 text-lg max-w-xl">
              Полный спектр изделий из оцинкованной стали, стали с полимерным покрытием и меди
            </p>
          </div>
        </section>

        <section className="py-6 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur-md z-40">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setFilter(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  !filter
                    ? "bg-copper text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-copper/10"
                }`}
              >
                Все категории
              </button>
              {catalogCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === cat.id
                      ? "bg-copper text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-copper/10"
                  }`}
                >
                  {cat.title.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all border border-border/50"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-lg bg-copper/10 flex items-center justify-center shrink-0">
                      <cat.icon className="w-7 h-7 text-copper" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-copper transition-colors">
                        {cat.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4">{cat.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {cat.items.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      <Link
                        to="/calculator"
                        className="inline-flex items-center mt-5 text-sm font-semibold text-copper hover:text-copper-dark transition-colors"
                      >
                        Рассчитать стоимость →
                      </Link>
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
