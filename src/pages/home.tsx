import { useEffect, useState, FC } from "react";

import HeroSection from "@/components/home/HeroSection";
import BannerCarousel from "@/components/home/BannerCarousel";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategorySection from "@/components/home/CategorySection";
import SeasonalSpecials from "@/components/home/SeasonalSpecials";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import NewsletterSection from "@/components/home/NewsletterSection";

const Home: FC = () => {
  const [randomProductPage, setRandomProductPage] = useState<number>(1);
  const [randomCategoryPage, setRandomCategoryPage] = useState<number>(1);

  useEffect(() => {
    setRandomProductPage(Math.floor(Math.random() * 20) + 1);
    setRandomCategoryPage(Math.floor(Math.random()) + 1);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Banner Section */}
      <section className="w-full py-4 md:py-6 lg:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="w-full h-48 md:h-64 lg:h-80 xl:h-96">
            <BannerCarousel />
          </div>
        </div>
      </section>

      <HeroSection />
      <FeaturedProducts randomProductPage={randomProductPage} />
      <CategorySection randomCategoryPage={randomCategoryPage} />
      <SeasonalSpecials randomProductPage={randomProductPage} />
      <SustainabilitySection />
      <NewsletterSection />
    </div>
  );
};

export default Home;
