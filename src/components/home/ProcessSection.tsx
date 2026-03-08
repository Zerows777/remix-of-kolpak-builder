import { motion } from "framer-motion";
import { Ruler, Calculator, Cog, Wrench } from "lucide-react";

const steps = [
  { icon: Ruler, step: "01", title: "Замер", desc: "Выезд на объект или расчёт по вашим размерам" },
  { icon: Calculator, step: "02", title: "Расчёт", desc: "Точная калькуляция с учётом всех параметров" },
  { icon: Cog, step: "03", title: "Производство", desc: "Изготовление на современном оборудовании от 1 дня" },
  { icon: Wrench, step: "04", title: "Монтаж", desc: "Профессиональная установка с гарантией" },
];

const ProcessSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-14">
          <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ 04 ]</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 tracking-tighter">
            Процесс
          </h2>
          <div className="w-20 h-1 bg-accent mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-primary p-6 border-brutal-thin hover-lift group"
            >
              <span className="text-6xl font-black text-accent/20 font-mono block leading-none mb-4">
                {s.step}
              </span>
              <div className="w-10 h-10 bg-accent flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-bold text-primary-foreground uppercase tracking-tight text-lg mb-2">
                {s.title}
              </h3>
              <p className="text-xs text-primary-foreground/40 font-mono leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
