import { motion } from "framer-motion";
import { Factory, Zap, Shield, Truck, Award } from "lucide-react";

const advantages = [
  { icon: Factory, title: "Своё производство", desc: "Полный цикл от проектирования до готового изделия" },
  { icon: Zap, title: "Лазерная резка", desc: "Высокоточное оборудование для идеальной геометрии" },
  { icon: Award, title: "Патинирование меди", desc: "Искусственное состаривание для благородного вида" },
  { icon: Truck, title: "Доставка по РБ", desc: "Собственный транспорт, бережная упаковка" },
  { icon: Shield, title: "Гарантия 10 лет", desc: "На все изделия с полимерным покрытием" },
];

const AdvantagesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Почему <span className="text-gradient-copper">Kolpak.by</span>
          </h2>
          <p className="text-muted-foreground">Преимущества работы с нами</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {advantages.map((adv, i) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-copper flex items-center justify-center mb-4 shadow-copper">
                <adv.icon className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{adv.title}</h3>
              <p className="text-sm text-muted-foreground">{adv.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
