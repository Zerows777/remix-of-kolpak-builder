import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import AdvantagesSection from "@/components/home/AdvantagesSection";
import ProcessSection from "@/components/home/ProcessSection";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import ContactSection from "@/components/home/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
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
