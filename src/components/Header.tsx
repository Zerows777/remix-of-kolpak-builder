import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Главная", path: "/" },
  { label: "Каталог", path: "/catalog" },
  
  { label: "Портфолио", path: "/portfolio" },
  { label: "О компании", path: "/about" },
  { label: "Контакты", path: "/contacts" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { enableAdminMode } = useAuth();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      enableAdminMode();
      navigate("/portfolio");
      return;
    }
    clickTimerRef.current = setTimeout(() => {
      if (clickCountRef.current < 3) {
        navigate("/");
      }
      clickCountRef.current = 0;
    }, 500);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary border-b-4 border-accent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-1 cursor-pointer select-none">
            <span className="text-2xl font-bold text-primary-foreground tracking-tighter uppercase">
              Kolpak
            </span>
            <span className="text-2xl font-bold text-accent">.by</span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 text-sm font-bold uppercase tracking-wider transition-all ${
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+375296111421"
              className="flex items-center gap-2 text-sm font-mono font-bold text-primary-foreground/70 hover:text-accent transition-colors"
            >
              <Phone className="w-4 h-4" />
              +375(29)611-14-21
            </a>
            <Link
              to="/contacts"
              className="px-5 py-2.5 bg-accent text-accent-foreground text-sm font-bold uppercase tracking-wider border-2 border-accent-foreground/20 shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal transition-all"
            >
              Заявка →
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-primary-foreground"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary border-t-2 border-accent"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-bold uppercase tracking-wider py-3 border-b border-primary-foreground/10 transition-colors ${
                    location.pathname === item.path
                      ? "text-accent"
                      : "text-primary-foreground/70"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
