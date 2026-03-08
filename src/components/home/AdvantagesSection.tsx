import { motion } from "framer-motion";
import { Factory, Palette, Shield, Truck, Award, Ruler } from "lucide-react";

const advantages = [
  { icon: Factory, num: "01", title: "Своё производство", desc: "Полный цикл от проектирования до готового изделия", highlight: false },
  { icon: Palette, num: "02", title: "Дизайн", desc: "Разработка индивидуальных решений под ваш проект", highlight: false },
  { icon: Ruler, num: "03", title: "Станок 3 метра", desc: "Гибка до 3 метров — таких мало в Беларуси", highlight: true },
  { icon: Award, num: "04", title: "Патинирование", desc: "Искусственное состаривание для благородного вида", highlight: false },
  { icon: Truck, num: "05", title: "Доставка по РБ", desc: "Собственный транспорт, бережная упаковка", highlight: false },
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
              className={`group flex items-center gap-6 py-6 border-b transition-colors ${
                adv.highlight 
                  ? "border-accent bg-accent/10 px-4 -mx-4" 
                  : "border-primary-foreground/10 hover:border-accent/50"
              }`}
            >
              <span className={`text-5xl font-black font-mono w-20 shrink-0 transition-colors ${
                adv.highlight ? "text-accent/40" : "text-primary-foreground/10 group-hover:text-accent/30"
              }`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={`w-12 h-12 flex items-center justify-center shrink-0 ${
                adv.highlight ? "bg-accent" : "bg-accent/10"
              }`}>
                <adv.icon className={`w-6 h-6 ${adv.highlight ? "text-accent-foreground" : "text-accent"}`} />
              </div>
              <div>
                <h3 className={`font-bold uppercase tracking-tight text-lg transition-colors ${
                  adv.highlight ? "text-accent" : "text-primary-foreground group-hover:text-accent"
                }`}>
                  {adv.title}
                  {adv.highlight && <span className="ml-2 text-[10px] font-mono bg-accent text-accent-foreground px-2 py-0.5 align-middle tracking-widest">РЕДКОСТЬ</span>}
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
