import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/home/ContactSection";
import { Factory, Users, Award, Truck, Shield, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "12+", label: "Лет на рынке" },
  { value: "5000+", label: "Заказов" },
  { value: "10", label: "Лет гарантии" },
  { value: "100%", label: "Своё производство" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 lg:pt-24">
        <section className="bg-primary noise-texture py-16 border-b-4 border-accent">
          <div className="container mx-auto px-4">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ О компании ]</span>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mt-2 tracking-tighter">Kolpak.by</h1>
            <p className="text-primary-foreground/40 text-sm font-mono mt-3">Производство изделий из металла и меди</p>
          </div>
        </section>

        <section className="py-16 stripe-bg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tighter mb-6">
                  Долговечные изделия <span className="text-accent">из металла</span>
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground font-mono leading-relaxed">
                  <p>Компания Kolpak.by — современное производство доборных элементов кровли, изделий из меди и жестяных работ. На рынке Беларуси более 12 лет.</p>
                  <p>Цех оснащён листогибочным оборудованием и вальцовочными установками — изделия любой сложности с точностью до 0.1 мм.</p>
                  <p>Работаем с частными заказчиками, строительными компаниями, архитекторами и дилерами по всей республике.</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="border-brutal overflow-hidden shadow-brutal">
                  <img src={heroBg} alt="Производство" className="w-full h-80 lg:h-96 object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-primary noise-texture">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-center p-6 border-2 border-primary-foreground/10">
                  <span className="text-4xl md:text-5xl font-black text-accent font-mono">{s.value}</span>
                  <p className="text-xs text-primary-foreground/40 font-mono uppercase tracking-wider mt-2">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ Преимущества ]</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tighter mt-2 mb-10">Почему мы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Factory, title: "Собственный цех", desc: "Полный цикл — от раскроя до финишного покрытия" },
                { icon: Zap, title: "Оборудование", desc: "ЧПУ-гибка, вальцовка, точная обработка" },
                { icon: Users, title: "Команда", desc: "Инженеры и жестянщики с опытом от 10 лет" },
                { icon: Award, title: "Материалы", desc: "Сертифицированная сталь и медь" },
                { icon: Shield, title: "Гарантия", desc: "До 10 лет на полимерное покрытие" },
                { icon: Truck, title: "Доставка", desc: "По всей РБ собственным транспортом" },
              ].map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-4 p-5 bg-card border-brutal-thin hover-lift">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground uppercase tracking-tight text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
