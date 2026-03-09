import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Categories from "@/components/Categories";
import FeaturedMentors from "@/components/FeaturedMentors";
import TeachCTA from "@/components/TeachCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Categories />
      <FeaturedMentors />
      <TeachCTA />
      <Footer />
    </div>
  );
};

export default Index;
