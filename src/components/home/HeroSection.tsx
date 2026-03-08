import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calculator } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-primary">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 noise-texture" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative container mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-[0.2em] font-mono mb-8"
          >
            ★ Производство в Беларуси
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-bold text-primary-foreground leading-[0.9] tracking-tighter mb-8">
            МЕТАЛЛ
            <br />
            <span className="text-accent">И МЕДЬ</span>
            <br />
            <span className="text-primary-foreground/30 text-3xl md:text-5xl lg:text-6xl tracking-tight">
              В АРХИТЕКТУРЕ
            </span>
          </h1>

          <p className="text-sm md:text-base text-primary-foreground/40 max-w-lg mb-10 leading-relaxed font-mono">
            Колпаки на дымоходы // Доборные элементы кровли // Вытяжки из меди //
            Заборы ранчо // Изготовление по размерам
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-bold uppercase tracking-wider border-2 border-accent-foreground/20 shadow-brutal hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-brutal-hover transition-all"
            >
              Каталог
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/calculator"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border-3 border-primary-foreground/30 text-primary-foreground font-bold uppercase tracking-wider hover:border-accent hover:text-accent transition-all"
            >
              <Calculator className="w-5 h-5" />
              Расчёт
            </Link>
          </div>
        </motion.div>

        {/* Side label */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
          <div className="rotate-90 origin-center whitespace-nowrap text-xs font-mono text-primary-foreground/20 tracking-[0.5em] uppercase">
            Kolpak.by — 2026
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] text-primary-foreground/30 tracking-[0.4em] uppercase font-mono">Scroll</span>
          <div className="w-px h-12 bg-accent/50" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
