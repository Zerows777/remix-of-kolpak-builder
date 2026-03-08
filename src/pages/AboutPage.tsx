import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/home/ContactSection";
import { Factory, Users, Award, Truck, Shield, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "12+", label: "Лет на рынке" },
  { value: "5000+", label: "Выполненных заказов" },
  { value: "10", label: "Лет гарантии" },
  { value: "100%", label: "Собственное производство" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 lg:pt-24">
        <section className="bg-gradient-graphite metal-texture py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-3">О компании</h1>
            <p className="text-primary-foreground/50 text-lg">Kolpak.by — производство изделий из металла и меди</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Мы создаём <span className="text-gradient-copper">долговечные изделия</span> из металла
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Компания Kolpak.by — это современное производство доборных элементов кровли, 
                    изделий из меди и жестяных работ. Мы работаем на рынке Беларуси более 12 лет.
                  </p>
                  <p>
                    Наш производственный цех оснащён станками лазерной резки, листогибочным 
                    оборудованием и вальцовочными установками, позволяющими изготавливать изделия 
                    любой сложности с точностью до 0.1 мм.
                  </p>
                  <p>
                    Мы работаем как с частными заказчиками, так и со строительными компаниями, 
                    архитекторами и дилерами по всей республике.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden"
              >
                <img src={heroBg} alt="Производство Kolpak.by" className="w-full h-80 lg:h-96 object-cover rounded-xl" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-warm-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <span className="text-4xl md:text-5xl font-black text-gradient-copper">{s.value}</span>
                  <p className="text-sm text-muted-foreground mt-2">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">Наши преимущества</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Factory, title: "Собственный цех", desc: "Полный цикл производства — от раскроя до финишного покрытия. Никаких посредников." },
                { icon: Zap, title: "Современное оборудование", desc: "Лазерная резка, ЧПУ-гибка, вальцовка. Точность до 0.1 мм." },
                { icon: Users, title: "Опытная команда", desc: "Инженеры-технологи, жестянщики и монтажники с опытом от 10 лет." },
                { icon: Award, title: "Качественные материалы", desc: "Сертифицированная сталь и медь от проверенных поставщиков." },
                { icon: Shield, title: "Гарантия до 10 лет", desc: "На все изделия с полимерным покрытием и медные изделия." },
                { icon: Truck, title: "Доставка по всей РБ", desc: "Собственный транспорт. Бережная упаковка и доставка до объекта." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-card"
                >
                  <div className="w-12 h-12 rounded-lg bg-copper/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-copper" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
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
