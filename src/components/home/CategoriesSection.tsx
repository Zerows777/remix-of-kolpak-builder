import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Home, ChefHat, Fence, Wind, FileText } from "lucide-react";

const categories = [
  { icon: Flame, label: "Колпаки на дымоходы", desc: "Сталь и медь", path: "/catalog" },
  { icon: Home, label: "Доборные элементы", desc: "Коньки, ендовы, планки", path: "/catalog" },
  { icon: ChefHat, label: "Изделия из меди", desc: "Вытяжки, камины", path: "/catalog" },
  { icon: Fence, label: "Заборы ранчо", desc: "Ворота, калитки", path: "/catalog" },
  { icon: Wind, label: "Вент. решётки", desc: "Наружные, внутренние", path: "/catalog" },
  { icon: FileText, label: "По чертежам", desc: "Индивидуальные заказы", path: "/catalog" },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 bg-warm-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Наша продукция
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Полный спектр изделий из металла и меди для кровли, фасадов и интерьеров
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={cat.path}
                className="group flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-lg bg-copper/10 flex items-center justify-center mb-4 group-hover:bg-copper/20 transition-colors">
                  <cat.icon className="w-7 h-7 text-copper" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{cat.label}</h3>
                <p className="text-xs text-muted-foreground">{cat.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
