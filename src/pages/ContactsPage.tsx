import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/home/ContactSection";
import SEO from "@/components/SEO";

const ContactsPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Контакты — Kolpak.by | Связаться с производителем в Беларуси"
        description="Свяжитесь с Kolpak.by: телефон, email, мессенджеры. Производство колпаков на дымоходы, изделий из меди и доборных элементов кровли в Беларуси."
        keywords="контакты, kolpak.by, связаться, производитель, Беларусь, Минск"
        canonical="/contacts"
      />
      <Header />
      <div className="pt-20 lg:pt-24">
        <section className="bg-primary noise-texture py-16 border-b-4 border-accent">
          <div className="container mx-auto px-4">
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-[0.3em]">[ Контакты ]</span>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mt-2 tracking-tighter">Связаться</h1>
            <p className="text-primary-foreground/40 text-sm font-mono mt-3">Любым удобным способом</p>
          </div>
        </section>
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default ContactsPage;
