import { useEffect, useState, FC } from "react";

import HeroSection from "@/components/home/HeroSection";
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
