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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Свяжитесь с нами
            </h2>
            <p className="text-muted-foreground mb-8">
              Оставьте заявку и мы перезвоним в течение 30 минут для консультации
            </p>

            <div className="space-y-5">
              {[
                { icon: Phone, label: "+375 (29) 123-45-67", sub: "Звоните ежедневно" },
                { icon: Mail, label: "info@kolpak.by", sub: "Ответим в течение часа" },
                { icon: MapPin, label: "г. Минск, ул. Промышленная, 15", sub: "Производственный цех" },
                { icon: Clock, label: "Пн-Пт: 8:00–18:00, Сб: 9:00–15:00", sub: "График работы" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-copper/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-copper" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.sub}</p>
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
            <form className="bg-card rounded-xl p-8 shadow-card space-y-5">
              <h3 className="text-xl font-bold text-foreground mb-2">Оставить заявку</h3>
              <div>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/50"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Телефон"
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/50"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  placeholder="Опишите ваш запрос"
                  className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-copper/50 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-copper text-accent-foreground font-semibold rounded-md hover:bg-copper-light transition-colors shadow-copper"
              >
                Отправить заявку
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
