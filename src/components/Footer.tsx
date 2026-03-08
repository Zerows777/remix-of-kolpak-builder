import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground border-t-4 border-accent">
      {/* Marquee */}
      <div className="bg-accent py-2 marquee-line">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-foreground">
          &nbsp;★ Колпаки ★ Кровля ★ Медь ★ Заборы ★ Вытяжки ★ Решётки ★ По чертежам ★ Колпаки ★ Кровля ★ Медь ★ Заборы ★ Вытяжки ★ Решётки ★ По чертежам ★ Колпаки ★ Кровля ★ Медь ★ Заборы ★ Вытяжки ★ Решётки ★ По чертежам&nbsp;
        </span>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-3xl font-bold tracking-tighter mb-4">
              KOLPAK<span className="text-accent">.BY</span>
            </h3>
            <p className="text-primary-foreground/50 text-base leading-relaxed font-mono">
              Производство доборных элементов кровли, изделий из меди и жестяных работ.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-accent">Каталог</h4>
            <ul className="space-y-2 text-primary-foreground/50">
              {["Колпаки на дымоходы", "Доборные элементы", "Изделия из меди", "Заборы ранчо", "Вент. решётки"].map(item => (
                <li key={item}>
                  <Link to="/catalog" className="hover:text-accent transition-colors font-mono text-sm">
                    → {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-accent">Компания</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/50">
              {[
                { label: "О компании", path: "/about" },
                { label: "Портфолио", path: "/portfolio" },
                { label: "Калькулятор", path: "/calculator" },
                { label: "Контакты", path: "/contacts" },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.path} className="hover:text-accent transition-colors font-mono text-sm">
                    → {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-accent">Контакты</h4>
            <ul className="space-y-3 text-primary-foreground/50 font-mono text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                +375 (29) 611-14-21
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                info@kolpak.by
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                г. Минск, ул. Промышленная, 15
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t-2 border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/30 font-mono">© 2026 KOLPAK.BY</p>
          <p className="text-sm text-primary-foreground/30 font-mono">МЕТАЛЛ • МЕДЬ • АРХИТЕКТУРА</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
