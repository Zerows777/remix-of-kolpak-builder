import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, Check } from "lucide-react";

type Shape = "односкатный" | "двухскатный" | "шатровый" | "флюгарка";
type Material = "galvanized" | "polyester" | "printech" | "copper" | "copper-patina";

const shapes: { id: Shape; label: string }[] = [
  { id: "односкатный", label: "Односкатный" },
  { id: "двухскатный", label: "Двухскатный" },
  { id: "шатровый", label: "Шатровый" },
  { id: "флюгарка", label: "Флюгарка" },
];

const materials: { id: Material; label: string; priceMultiplier: number }[] = [
  { id: "galvanized", label: "Оцинкованная сталь", priceMultiplier: 1 },
  { id: "polyester", label: "Полиэстер (RAL)", priceMultiplier: 1.3 },
  { id: "printech", label: "Printech (текстура)", priceMultiplier: 1.5 },
  { id: "copper", label: "Медь натуральная", priceMultiplier: 3.5 },
  { id: "copper-patina", label: "Медь с патиной", priceMultiplier: 4.2 },
];

const basePriceMap: Record<Shape, number> = {
  "односкатный": 85, "двухскатный": 110, "шатровый": 145, "флюгарка": 190,
};

const CalculatorPage = () => {
  const [step, setStep] = useState(1);
  const [shape, setShape] = useState<Shape | null>(null);
  const [width, setWidth] = useState(400);
  const [length, setLength] = useState(400);
  const [height, setHeight] = useState<"standard" | "extended">("standard");
  const [material, setMaterial] = useState<Material | null>(null);
  const [extras, setExtras] = useState<string[]>([]);

  const toggleExtra = (e: string) => setExtras(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);

  const calcPrice = () => {
    if (!shape || !material) return 0;
    const base = basePriceMap[shape];
    const mat = materials.find(m => m.id === material)!;
    const area = (width / 1000) * (length / 1000);
    const hMult = height === "extended" ? 1.25 : 1;
    let price = base * mat.priceMultiplier * Math.max(area, 0.16) * 10 * hMult;
    if (extras.includes("spark")) price += 25;
    if (extras.includes("insulation")) price += 35;
    if (extras.includes("mount")) price += 15;
    return Math.round(price);
  };

  const canNext = () => {
    if (step === 1) return !!shape;
    if (step === 4) return !!material;
    return true;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 lg:pt-24">
        <section className="bg-primary noise-texture py-16 border-b-4 border-accent">
          <div className="container mx-auto px-4">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ Калькулятор ]</span>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mt-2 tracking-tighter">
              Расчёт стоимости
            </h1>
            <p className="text-primary-foreground/40 text-sm font-mono mt-3">
              Колпак на дымоход — онлайн-калькулятор
            </p>
          </div>
        </section>

        <section className="py-12 stripe-bg">
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Steps indicator */}
            <div className="flex items-center justify-between mb-10">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <button
                    onClick={() => s < step && setStep(s)}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-bold font-mono transition-all ${
                      s === step
                        ? "bg-accent text-accent-foreground shadow-brutal-sm"
                        : s < step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground border-brutal-thin"
                    }`}
                  >
                    {s < step ? <Check className="w-5 h-5" /> : `0${s}`}
                  </button>
                  {s < 5 && (
                    <div className={`hidden sm:block w-8 lg:w-16 h-0.5 mx-1 ${s < step ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card border-brutal p-8 shadow-brutal"
            >
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-tight mb-6">
                    <span className="text-accent font-mono">01</span> — Форма колпака
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {shapes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setShape(s.id)}
                        className={`p-5 text-left transition-all font-bold uppercase tracking-tight ${
                          shape === s.id
                            ? "bg-primary text-primary-foreground shadow-brutal-sm"
                            : "bg-muted text-foreground border-brutal-thin hover:bg-primary/5"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-tight mb-6">
                    <span className="text-accent font-mono">02</span> — Размеры основания (мм)
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-2">Ширина</label>
                      <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full px-4 py-3 border-brutal-thin bg-background text-foreground font-mono text-lg focus:outline-none focus:border-accent" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-2">Длина</label>
                      <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full px-4 py-3 border-brutal-thin bg-background text-foreground font-mono text-lg focus:outline-none focus:border-accent" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-tight mb-6">
                    <span className="text-accent font-mono">03</span> — Высота колпака
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {(["standard", "extended"] as const).map((h) => (
                      <button key={h} onClick={() => setHeight(h)}
                        className={`p-5 text-left font-bold uppercase tracking-tight transition-all ${
                          height === h
                            ? "bg-primary text-primary-foreground shadow-brutal-sm"
                            : "bg-muted text-foreground border-brutal-thin hover:bg-primary/5"
                        }`}
                      >
                        {h === "standard" ? "Стандартная" : "Увеличенная +25%"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-tight mb-6">
                    <span className="text-accent font-mono">04</span> — Материал
                  </h2>
                  <div className="space-y-2">
                    {materials.map((m) => (
                      <button key={m.id} onClick={() => setMaterial(m.id)}
                        className={`w-full p-4 text-left flex justify-between items-center transition-all font-bold ${
                          material === m.id
                            ? "bg-primary text-primary-foreground shadow-brutal-sm"
                            : "bg-muted text-foreground border-brutal-thin hover:bg-primary/5"
                        }`}
                      >
                        <span className="uppercase tracking-tight text-sm">{m.label}</span>
                        <span className="font-mono text-xs opacity-60">×{m.priceMultiplier}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-tight mb-6">
                    <span className="text-accent font-mono">05</span> — Дополнения
                  </h2>
                  <div className="space-y-2 mb-8">
                    {[
                      { id: "spark", label: "Искрогаситель (сетка)", price: "+25 BYN" },
                      { id: "insulation", label: "Утепление базы", price: "+35 BYN" },
                      { id: "mount", label: "Монтажный комплект", price: "+15 BYN" },
                    ].map((e) => (
                      <button key={e.id} onClick={() => toggleExtra(e.id)}
                        className={`w-full p-4 text-left flex justify-between items-center transition-all ${
                          extras.includes(e.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground border-brutal-thin hover:bg-primary/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                            extras.includes(e.id) ? "border-accent bg-accent" : "border-foreground"
                          }`}>
                            {extras.includes(e.id) && <Check className="w-3 h-3 text-accent-foreground" />}
                          </div>
                          <span className="font-bold uppercase tracking-tight text-sm">{e.label}</span>
                        </div>
                        <span className="font-mono text-xs opacity-60">{e.price}</span>
                      </button>
                    ))}
                  </div>

                  {/* Result */}
                  <div className="bg-primary p-6 border-2 border-accent">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-primary-foreground/50 font-mono text-xs uppercase">Форма</span>
                        <span className="text-primary-foreground font-bold uppercase">{shape}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-foreground/50 font-mono text-xs uppercase">Размер</span>
                        <span className="text-primary-foreground font-mono font-bold">{width}×{length}mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-foreground/50 font-mono text-xs uppercase">Материал</span>
                        <span className="text-primary-foreground font-bold text-xs uppercase">{materials.find(m => m.id === material)?.label}</span>
                      </div>
                    </div>
                    <div className="border-t-2 border-accent mt-4 pt-4 flex justify-between items-end">
                      <span className="text-primary-foreground font-bold uppercase tracking-wider">Итого:</span>
                      <span className="text-4xl font-black text-accent font-mono">{calcPrice()} <span className="text-lg">BYN</span></span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)}
                    className="px-6 py-3 border-brutal-thin text-foreground font-bold uppercase tracking-wider text-sm hover:bg-muted transition-colors">
                    ← Назад
                  </button>
                ) : <div />}
                {step < 5 ? (
                  <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-bold uppercase tracking-wider text-sm shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    Далее <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="px-8 py-3 bg-accent text-accent-foreground font-bold uppercase tracking-wider shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal transition-all">
                    Оформить заказ →
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CalculatorPage;
