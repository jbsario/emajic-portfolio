import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PageLoader from "@/components/PageLoader";
import ScrollProgress from "@/components/ScrollProgress";

import AboutSection from "@/components/AboutSection";
import ObjectivesSection from "@/components/ObjectivesSection";
import ProjectRangeSection from "@/components/ProjectRangeSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageLoader />
      <ScrollProgress />
      
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ObjectivesSection />
      <ProjectRangeSection />
      <ServicesSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
