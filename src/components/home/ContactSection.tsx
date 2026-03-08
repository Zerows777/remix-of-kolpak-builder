import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ Контакты ]</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-2 tracking-tighter mb-8">
              Связаться
            </h2>

            <div className="space-y-5">
              {[
                { icon: Phone, label: "+375 (29) 611-14-21", sub: "Ежедневно" },
                { icon: Mail, label: "info@kolpak.by", sub: "Ответ в течение часа" },
                { icon: MapPin, label: "г. Смолевичи, ул. Торговая, 8А", sub: "Производственный цех" },
                { icon: Clock, label: "Пн–Пт: 8:00–18:00, Сб: 9:00–15:00", sub: "График работы" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground font-mono">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-card border-brutal p-8 shadow-brutal space-y-5">
              <h3 className="text-xl font-bold text-foreground uppercase tracking-tight">Заявка</h3>
              <div>
                <label className="block text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-2">Имя</label>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 border-brutal-thin bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-2">Телефон</label>
                <input
                  type="tel"
                  placeholder="+375 (__) ___-__-__"
                  className="w-full px-4 py-3 border-brutal-thin bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-2">Сообщение</label>
                <textarea
                  rows={3}
                  placeholder="Опишите ваш запрос"
                  className="w-full px-4 py-3 border-brutal-thin bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-accent text-accent-foreground font-bold uppercase tracking-wider shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal transition-all"
              >
                Отправить заявку →
              </button>
              <p className="text-[10px] text-muted-foreground text-center font-mono">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
