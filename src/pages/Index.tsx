import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import AdvantagesSection from "@/components/home/AdvantagesSection";
import ProcessSection from "@/components/home/ProcessSection";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import ContactSection from "@/components/home/ContactSection";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Kolpak.by — Колпаки на дымоходы, доборные элементы кровли и изделия из меди"
        description="Производство в Беларуси: колпаки на дымоходы, доборные элементы кровли, медные вытяжки, заборы ранчо, парапеты, вентиляционные решётки. Изготовление по чертежам и индивидуальным размерам."
        keywords="колпаки на дымоходы, дымник, доборные элементы кровли, изделия из меди, вытяжка из меди, забор ранчо, парапет, изготовление по чертежам, Беларусь, Минск"
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Kolpak.by",
          url: "https://kolpak.by/",
          inLanguage: "ru-RU",
          publisher: { "@type": "Organization", name: "Kolpak.by", url: "https://kolpak.by/" },
        }}
      />
      <Header />
      <HeroSection />
      <CategoriesSection />
      <AdvantagesSection />
      <PortfolioPreview />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
