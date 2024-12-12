import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import HeroSection from "@/components/HeroSection";
import NewsGrid from "@/components/NewsGrid";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NewsTicker />
      <main className="flex-1">
        <HeroSection />
        <NewsGrid />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;