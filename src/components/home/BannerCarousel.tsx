import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { useGetBannersQuery } from "@/services";
import type { Banner } from "@/types/banner";

const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    data: bannersResponse,
    isLoading,
    isError,
  } = useGetBannersQuery({
    pageNumber: 1,
    pageSize: 10,
  });

  const banners = bannersResponse?.items || [];

  // Auto slide every 2 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-xl" />
    );
  }

  if (isError || !banners.length) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No banners available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl group bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      {/* Banner Images */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner: Banner) => (
          <div
            key={banner.id}
            className="w-full h-full flex-shrink-0 relative flex items-center justify-center bg-white dark:bg-gray-900"
          >
            <img
              src={banner.imageUrl}
              alt={banner.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 md:p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 md:p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next banner"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 md:space-x-3">
          {banners.map((_: Banner, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "text-white scale-110"
                  : "text-white/60 hover:text-white/80"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            >
              <Circle
                className={`h-3 w-3 md:h-4 md:w-4 ${
                  index === currentIndex ? "fill-current" : ""
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
