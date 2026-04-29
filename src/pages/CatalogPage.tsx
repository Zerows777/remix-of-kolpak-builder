import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  Flame, Home, ChefHat, Fence, Wind, FileText, Layers, Grid3X3,
  Pencil, Plus, Trash2, X, Save, EyeOff, Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ICONS: Record<string, any> = {
  Flame, Home, ChefHat, Fence, Wind, FileText, Layers, Grid3X3,
};
const ICON_NAMES = Object.keys(ICONS);

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  items: string[] | null;
  show_in_catalog: boolean;
  slug: string | null;
  sort_order: number | null;
}

const emptyCategory = (sort_order: number): Omit<Category, "id"> => ({
  name: "",
  description: "",
  icon: "FileText",
  items: [],
  show_in_catalog: true,
  slug: "",
  sort_order,
});

const CatalogPage = () => {
  const { isAdmin } = useAuth();
  const [filter, setFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error("Ошибка загрузки: " + error.message);
    setCategories((data as Category[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const visible = categories.filter((c) => isAdmin || c.show_in_catalog);
  const filtered = filter ? visible.filter((c) => c.id === filter) : visible;

  const startEdit = (cat: Category) => { setEditing({ ...cat, items: cat.items || [] }); setIsNew(false); };
  const startCreate = () => {
    const maxOrder = Math.max(0, ...categories.map((c) => c.sort_order || 0));
    setEditing({ id: "", ...emptyCategory(maxOrder + 1) });
    setIsNew(true);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error("Название обязательно"); return; }
    const payload = {
      name: editing.name.trim(),
      description: editing.description?.trim() || null,
      icon: editing.icon || "FileText",
      items: (editing.items || []).map((s) => s.trim()).filter(Boolean),
      show_in_catalog: editing.show_in_catalog,
      slug: editing.slug?.trim() || null,
      sort_order: editing.sort_order ?? 0,
    };
    if (isNew) {
      const { error } = await supabase.from("portfolio_categories").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Категория добавлена");
    } else {
      const { error } = await supabase.from("portfolio_categories").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Сохранено");
    }
    setEditing(null);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить категорию из каталога? Это действие удалит её и из портфолио.")) return;
    const { error } = await supabase.from("portfolio_categories").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Удалено");
    setEditing(null);
    await load();
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Каталог продукции — Kolpak.by | Колпаки, кровля, медь, заборы"
        description="Каталог изделий: колпаки на дымоходы, доборные элементы кровли, изделия из меди, заборы ранчо, парапеты, вентиляционные решётки и изделия по чертежам. Производство в Беларуси."
        keywords="каталог, колпаки на дымоходы, доборные элементы кровли, изделия из меди, заборы ранчо, парапеты, вентрешётки"
        canonical="/catalog"
      />
      <Header />
      <div className="pt-20 lg:pt-24">
        {/* Hero */}
        <section className="bg-primary noise-texture py-16 border-b-4 border-accent">
          <div className="container mx-auto px-4 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ Каталог ]</span>
              <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mt-2 tracking-tighter">
                Продукция
              </h1>
              <p className="text-primary-foreground/40 text-sm font-mono mt-3 max-w-lg">
                Полный спектр изделий из оцинкованной стали, стали с полимерным покрытием и меди
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={startCreate}
                className="px-4 py-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Добавить категорию
              </button>
            )}
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 border-b-2 border-foreground sticky top-16 lg:top-20 bg-background z-40">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setFilter(null)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  !filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}
              >
                Все
              </button>
              {visible.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(filter === cat.id ? null : cat.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    filter === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  {cat.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12 stripe-bg">
          <div className="container mx-auto px-4">
            {loading ? (
              <p className="font-mono text-sm text-muted-foreground">Загрузка…</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((cat, i) => {
                  const Icon = ICONS[cat.icon || "FileText"] || FileText;
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group bg-card border-brutal-thin hover-lift relative ${!cat.show_in_catalog ? "opacity-60" : ""}`}
                    >
                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex gap-1 z-10">
                          {!cat.show_in_catalog && (
                            <span className="px-2 py-1 bg-muted text-muted-foreground text-[10px] font-mono font-bold uppercase">скрыто</span>
                          )}
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-2 bg-accent text-accent-foreground shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                            aria-label="Редактировать"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-start gap-5">
                          <div className="w-14 h-14 bg-primary flex items-center justify-center shrink-0">
                            <Icon className="w-6 h-6 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-lg font-bold text-foreground uppercase tracking-tight group-hover:text-accent transition-colors">
                              {cat.name}
                            </h2>
                            {cat.description && (
                              <p className="text-xs text-muted-foreground font-mono mt-1">{cat.description}</p>
                            )}
                            {cat.items && cat.items.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-4">
                                {cat.items.map((item) => (
                                  <span key={item} className="px-2 py-1 text-[10px] font-mono font-bold bg-muted text-muted-foreground uppercase tracking-wider">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            )}
                            <Link
                              to={`/portfolio?category=${encodeURIComponent(cat.name)}`}
                              className="inline-block mt-5 px-4 py-2 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                            >
                              Подробнее →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div
            className="bg-card border-brutal w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b-2 border-foreground sticky top-0 bg-card">
              <h3 className="font-bold text-lg uppercase tracking-tight">
                {isNew ? "Новая категория" : "Редактирование"}
              </h3>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider mb-1 block">Название *</label>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-foreground bg-background font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider mb-1 block">Описание</label>
                <textarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-foreground bg-background font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-wider mb-1 block">Иконка</label>
                  <select
                    value={editing.icon || "FileText"}
                    onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-foreground bg-background font-mono text-sm"
                  >
                    {ICON_NAMES.map((n) => (<option key={n} value={n}>{n}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-wider mb-1 block">Порядок</label>
                  <input
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border-2 border-foreground bg-background font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase tracking-wider mb-1 block">
                  Пункты (через перенос строки)
                </label>
                <textarea
                  value={(editing.items || []).join("\n")}
                  onChange={(e) => setEditing({ ...editing, items: e.target.value.split("\n") })}
                  rows={6}
                  className="w-full px-3 py-2 border-2 border-foreground bg-background font-mono text-sm"
                  placeholder={"Колпаки на дымоходы\nОбшивка дымохода"}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editing.show_in_catalog}
                  onChange={(e) => setEditing({ ...editing, show_in_catalog: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  {editing.show_in_catalog ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  Показывать в каталоге
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between gap-2 p-4 border-t-2 border-foreground sticky bottom-0 bg-card">
              {!isNew ? (
                <button
                  onClick={() => remove(editing.id)}
                  className="px-3 py-2 bg-destructive text-destructive-foreground text-xs font-bold uppercase tracking-wider shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Удалить
                </button>
              ) : <span />}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider"
                >
                  Отмена
                </button>
                <button
                  onClick={save}
                  className="px-4 py-2 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" /> Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
