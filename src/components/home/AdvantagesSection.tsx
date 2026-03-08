import { motion } from "framer-motion";
import { Factory, Zap, Shield, Truck, Award } from "lucide-react";

const advantages = [
  { icon: Factory, num: "01", title: "Своё производство", desc: "Полный цикл от проектирования до готового изделия" },
  { icon: Award, num: "02", title: "Патинирование", desc: "Искусственное состаривание для благородного вида" },
  { icon: Truck, num: "03", title: "Доставка по РБ", desc: "Собственный транспорт, бережная упаковка" },
  { icon: Shield, num: "04", title: "Гарантия 10 лет", desc: "На изделия с полимерным покрытием" },
  { icon: Shield, num: "05", title: "Гарантия 10 лет", desc: "На изделия с полимерным покрытием" },
];

const AdvantagesSection = () => {
  return (
    <section className="py-20 bg-primary noise-texture">
      <div className="container mx-auto px-4">
        <div className="mb-14">
          <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ 02 ]</span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-2 tracking-tighter">
            Почему мы
          </h2>
          <div className="w-20 h-1 bg-accent mt-4" />
        </div>

        <div className="space-y-0">
          {advantages.map((adv, i) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex items-center gap-6 py-6 border-b border-primary-foreground/10 hover:border-accent/50 transition-colors"
            >
              <span className="text-5xl font-black text-primary-foreground/10 group-hover:text-accent/30 transition-colors font-mono w-20 shrink-0">
                {adv.num}
              </span>
              <div className="w-12 h-12 bg-accent/10 flex items-center justify-center shrink-0">
                <adv.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-primary-foreground uppercase tracking-tight text-lg group-hover:text-accent transition-colors">
                  {adv.title}
                </h3>
                <p className="text-sm text-primary-foreground/40 font-mono">{adv.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
