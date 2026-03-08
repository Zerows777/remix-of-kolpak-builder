import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Home, ChefHat, Fence, Wind, FileText } from "lucide-react";

const categories = [
  { icon: Flame, label: "Колпаки на дымоходы", tag: "СТАЛЬ/МЕДЬ", path: "/catalog" },
  { icon: Home, label: "Доборные элементы", tag: "КРОВЛЯ", path: "/catalog" },
  { icon: ChefHat, label: "Изделия из меди", tag: "ИНТЕРЬЕР", path: "/catalog" },
  { icon: Fence, label: "Заборы ранчо", tag: "ОГРАЖДЕНИЯ", path: "/catalog" },
  { icon: Wind, label: "Вент. решётки", tag: "ВЕНТИЛЯЦИЯ", path: "/catalog" },
  { icon: FileText, label: "По чертежам", tag: "КАСТОМ", path: "/catalog" },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 bg-background stripe-bg">
      <div className="container mx-auto px-4">
        <div className="mb-14">
          <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ 01 ]</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 tracking-tighter">
            Продукция
          </h2>
          <div className="w-20 h-1 bg-accent mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={cat.path}
                className="group flex items-center gap-5 p-5 bg-card border-brutal-thin hover-lift"
              >
                <div className="w-14 h-14 bg-primary flex items-center justify-center shrink-0">
                  <cat.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground uppercase tracking-tight group-hover:text-accent transition-colors">
                    {cat.label}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground tracking-[0.2em]">{cat.tag}</span>
                </div>
                <span className="text-xl font-bold text-muted-foreground/30 group-hover:text-accent transition-colors">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
