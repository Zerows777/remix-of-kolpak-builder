import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calculator } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      <div className="absolute inset-0 metal-texture" />

      <div className="relative container mx-auto px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-copper/30 bg-copper/10 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-copper animate-pulse" />
            <span className="text-xs font-medium text-copper tracking-wide uppercase">
              Собственное производство в Беларуси
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-primary-foreground leading-[1.1] mb-6">
            Металл и медь
            <br />
            <span className="text-gradient-copper">в архитектуре</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/60 max-w-xl mb-10 leading-relaxed">
            Колпаки на дымоходы, доборные элементы кровли, кухонные вытяжки из меди 
            и заборы ранчо. Изготовление по индивидуальным размерам.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-copper text-accent-foreground font-semibold rounded-md hover:bg-copper-light transition-all shadow-copper shimmer"
            >
              Смотреть каталог
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/calculator"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-primary-foreground/20 text-primary-foreground font-semibold rounded-md hover:border-copper hover:text-copper transition-all"
            >
              <Calculator className="w-5 h-5" />
              Рассчитать стоимость
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-primary-foreground/40 tracking-widest uppercase">Прокрутите вниз</span>
          <div className="w-px h-10 bg-gradient-to-b from-copper/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
