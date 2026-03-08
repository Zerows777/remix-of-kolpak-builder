import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              KOLPAK<span className="text-gradient-copper">.by</span>
            </h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Производство доборных элементов кровли, изделий из меди и жестяных работ. Работаем по всей Беларуси.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-copper">Каталог</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/catalog" className="hover:text-copper transition-colors">Колпаки на дымоходы</Link></li>
              <li><Link to="/catalog" className="hover:text-copper transition-colors">Доборные элементы</Link></li>
              <li><Link to="/catalog" className="hover:text-copper transition-colors">Изделия из меди</Link></li>
              <li><Link to="/catalog" className="hover:text-copper transition-colors">Заборы ранчо</Link></li>
              <li><Link to="/catalog" className="hover:text-copper transition-colors">Вентиляционные решётки</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-copper">Компания</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/about" className="hover:text-copper transition-colors">О компании</Link></li>
              <li><Link to="/portfolio" className="hover:text-copper transition-colors">Портфолио</Link></li>
              <li><Link to="/calculator" className="hover:text-copper transition-colors">Калькулятор</Link></li>
              <li><Link to="/contacts" className="hover:text-copper transition-colors">Контакты</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-copper">Контакты</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-copper shrink-0" />
                <a href="tel:+375291234567" className="hover:text-copper transition-colors">+375 (29) 123-45-67</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-copper shrink-0" />
                <a href="mailto:info@kolpak.by" className="hover:text-copper transition-colors">info@kolpak.by</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-copper shrink-0 mt-0.5" />
                <span>г. Минск, ул. Промышленная, 15</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">
            © 2026 Kolpak.by — Все права защищены
          </p>
          <p className="text-xs text-primary-foreground/40">
            Производство доборных элементов кровли и изделий из меди
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
