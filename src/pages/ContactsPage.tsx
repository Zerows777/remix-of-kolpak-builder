import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/home/ContactSection";

const ContactsPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 lg:pt-24">
        <section className="bg-gradient-graphite metal-texture py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-3">Контакты</h1>
            <p className="text-primary-foreground/50 text-lg">Свяжитесь с нами любым удобным способом</p>
          </div>
        </section>
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default ContactsPage;
