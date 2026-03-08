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

const basePrice: Record<Shape, number> = {
  "односкатный": 85,
  "двухскатный": 110,
  "шатровый": 145,
  "флюгарка": 190,
};

const CalculatorPage = () => {
  const [step, setStep] = useState(1);
  const [shape, setShape] = useState<Shape | null>(null);
  const [width, setWidth] = useState(400);
  const [length, setLength] = useState(400);
  const [height, setHeight] = useState<"standard" | "extended">("standard");
  const [material, setMaterial] = useState<Material | null>(null);
  const [extras, setExtras] = useState<string[]>([]);

  const toggleExtra = (e: string) => {
    setExtras((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));
  };

  const calcPrice = () => {
    if (!shape || !material) return 0;
    const base = basePrice[shape];
    const mat = materials.find((m) => m.id === material)!;
    const area = (width / 1000) * (length / 1000);
    const heightMult = height === "extended" ? 1.25 : 1;
    let price = base * mat.priceMultiplier * Math.max(area, 0.16) * 10 * heightMult;
    if (extras.includes("spark")) price += 25;
    if (extras.includes("insulation")) price += 35;
    if (extras.includes("mount")) price += 15;
    return Math.round(price);
  };

  const canNext = () => {
    if (step === 1) return !!shape;
    if (step === 2) return width > 0 && length > 0;
    if (step === 3) return true;
    if (step === 4) return !!material;
    return true;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 lg:pt-24">
        <section className="bg-gradient-graphite metal-texture py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
              Калькулятор стоимости
            </h1>
            <p className="text-primary-foreground/50 text-lg">
              Рассчитайте стоимость колпака на дымоход онлайн
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Progress */}
            <div className="flex items-center justify-between mb-10">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <button
                    onClick={() => s < step && setStep(s)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      s === step
                        ? "bg-copper text-accent-foreground shadow-copper"
                        : s < step
                        ? "bg-copper/20 text-copper"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s < step ? <Check className="w-5 h-5" /> : s}
                  </button>
                  {s < 5 && (
                    <div className={`hidden sm:block w-12 lg:w-20 h-px mx-1 ${s < step ? "bg-copper/50" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>

            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl p-8 shadow-card border border-border/50"
            >
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">Шаг 1: Форма колпака</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {shapes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setShape(s.id)}
                        className={`p-5 rounded-lg border-2 text-left transition-all ${
                          shape === s.id
                            ? "border-copper bg-copper/5"
                            : "border-border hover:border-copper/50"
                        }`}
                      >
                        <span className="font-semibold text-foreground">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">Шаг 2: Размеры основания (мм)</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Ширина</label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-copper/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Длина</label>
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-copper/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">Шаг 3: Высота колпака</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {(["standard", "extended"] as const).map((h) => (
                      <button
                        key={h}
                        onClick={() => setHeight(h)}
                        className={`p-5 rounded-lg border-2 text-left transition-all ${
                          height === h
                            ? "border-copper bg-copper/5"
                            : "border-border hover:border-copper/50"
                        }`}
                      >
                        <span className="font-semibold text-foreground">
                          {h === "standard" ? "Стандартная" : "Увеличенная (+25%)"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">Шаг 4: Материал и покрытие</h2>
                  <div className="space-y-3">
                    {materials.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMaterial(m.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all flex justify-between items-center ${
                          material === m.id
                            ? "border-copper bg-copper/5"
                            : "border-border hover:border-copper/50"
                        }`}
                      >
                        <span className="font-medium text-foreground">{m.label}</span>
                        <span className="text-sm text-muted-foreground">×{m.priceMultiplier}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">Шаг 5: Дополнительно</h2>
                  <div className="space-y-3 mb-8">
                    {[
                      { id: "spark", label: "Искрогаситель (сетка)", price: "+25 BYN" },
                      { id: "insulation", label: "Утепление базы", price: "+35 BYN" },
                      { id: "mount", label: "Монтажный комплект", price: "+15 BYN" },
                    ].map((e) => (
                      <button
                        key={e.id}
                        onClick={() => toggleExtra(e.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all flex justify-between items-center ${
                          extras.includes(e.id)
                            ? "border-copper bg-copper/5"
                            : "border-border hover:border-copper/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            extras.includes(e.id) ? "border-copper bg-copper" : "border-border"
                          }`}>
                            {extras.includes(e.id) && <Check className="w-3 h-3 text-accent-foreground" />}
                          </div>
                          <span className="font-medium text-foreground">{e.label}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{e.price}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-gradient-graphite rounded-lg p-6 metal-texture">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-primary-foreground/60">Форма:</span>
                      <span className="text-primary-foreground font-medium capitalize">{shape}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-primary-foreground/60">Размер:</span>
                      <span className="text-primary-foreground font-medium">{width}×{length} мм</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-primary-foreground/60">Материал:</span>
                      <span className="text-primary-foreground font-medium">{materials.find(m => m.id === material)?.label}</span>
                    </div>
                    <div className="border-t border-primary-foreground/20 mt-4 pt-4 flex justify-between items-center">
                      <span className="text-primary-foreground font-semibold text-lg">Итого:</span>
                      <span className="text-3xl font-black text-gradient-copper">{calcPrice()} BYN</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 border border-border text-foreground rounded-md font-medium hover:bg-muted transition-colors"
                  >
                    Назад
                  </button>
                ) : (
                  <div />
                )}
                {step < 5 ? (
                  <button
                    onClick={() => canNext() && setStep(step + 1)}
                    disabled={!canNext()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-accent-foreground rounded-md font-semibold hover:bg-copper-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Далее <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="px-8 py-3 bg-copper text-accent-foreground rounded-md font-semibold hover:bg-copper-light transition-colors shadow-copper">
                    Оформить заказ
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
