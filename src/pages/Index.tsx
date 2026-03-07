import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import PlatformFeatures from "@/components/PlatformFeatures";
import UseCases from "@/components/UseCases";
import ServiceNetworkSection from "@/components/ServiceNetworkSection";
import ExampleInteraction from "@/components/ExampleInteraction";
import ReasonsTobelieve from "@/components/ReasonsTobelieve";
import ActivityFeed from "@/components/ActivityFeed";
import VisionSection from "@/components/VisionSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <ProblemSolutionSection />
      <PlatformFeatures />
      <ServiceNetworkSection />
      <ExampleInteraction />
      <UseCases />
      <ReasonsTobelieve />
      <ActivityFeed />
      <VisionSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
