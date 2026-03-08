import { motion } from "framer-motion";
import { Ruler, Calculator, Cog, Wrench } from "lucide-react";

const steps = [
  { icon: Ruler, step: "01", title: "Замер", desc: "Выезд специалиста на объект или расчёт по вашим размерам" },
  { icon: Calculator, step: "02", title: "Расчёт", desc: "Точная калькуляция стоимости с учётом всех параметров" },
  { icon: Cog, step: "03", title: "Изготовление", desc: "Производство на современном оборудовании от 1 дня" },
  { icon: Wrench, step: "04", title: "Монтаж", desc: "Профессиональная установка с гарантией качества" },
];

const ProcessSection = () => {
  return (
    <section className="py-20 bg-gradient-graphite metal-texture">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            Как мы работаем
          </h2>
          <p className="text-primary-foreground/50">От заявки до готового изделия</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <span className="text-6xl font-black text-copper/15 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                {s.step}
              </span>
              <div className="relative pt-8">
                <div className="w-14 h-14 mx-auto rounded-lg border border-copper/30 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-copper" />
                </div>
                <h3 className="font-semibold text-primary-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-primary-foreground/50">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-copper/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
