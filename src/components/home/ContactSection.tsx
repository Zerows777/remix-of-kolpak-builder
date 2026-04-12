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

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
