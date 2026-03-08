import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Главная", path: "/" },
  { label: "Каталог", path: "/catalog" },
  { label: "Калькулятор", path: "/calculator" },
  { label: "Портфолио", path: "/portfolio" },
  { label: "О компании", path: "/about" },
  { label: "Контакты", path: "/contacts" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-copper/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-foreground tracking-tight">
              KOLPAK<span className="text-gradient-copper">.by</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-copper ${
                  location.pathname === item.path
                    ? "text-copper"
                    : "text-primary-foreground/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+375291234567"
              className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-copper transition-colors"
            >
              <Phone className="w-4 h-4" />
              +375 (29) 123-45-67
            </a>
            <Link
              to="/calculator"
              className="px-5 py-2.5 bg-copper text-accent-foreground text-sm font-semibold rounded-md hover:bg-copper-light transition-colors"
            >
              Рассчитать стоимость
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-primary-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary border-t border-copper/20"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors ${
                    location.pathname === item.path
                      ? "text-copper"
                      : "text-primary-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="tel:+375291234567"
                className="flex items-center gap-2 text-sm font-medium text-copper py-2"
              >
                <Phone className="w-4 h-4" />
                +375 (29) 123-45-67
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
