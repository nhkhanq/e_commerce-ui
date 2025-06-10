import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl/none text-green-700 dark:text-green-400">
              Fresh & Organic Food
            </h1>
            <p className="text-gray-600 dark:text-gray-300 md:text-xl max-w-lg">
              Discover our selection of locally sourced, organic produce and
              sustainable food products for a healthier lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                to="/product-list"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 inline-block text-center"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <Link
            to="/product-list"
            className="relative h-80 md:h-96 overflow-hidden rounded-xl"
          >
            <div className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-800">
              <img
                src="https://ipoh.parade.com.my/wp-content/uploads/2023/05/Green-Party-1-scaled.jpg"
                alt="Fresh organic food"
                className="block w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent pointer-events-none" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
