import { Link } from "react-router-dom";
import type { SVGProps } from "react";

const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SustainabilitySection = () => {
  const features = [
    "100% Organically grown produce",
    "Supporting local farmers and communities",
    "Eco-friendly packaging solutions",
    "Fresh delivery to your doorstep",
  ];

  return (
    <section className="w-full py-16 bg-green-50 dark:bg-green-900/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm font-medium">
              Why Choose Us
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Committed to Sustainability
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We work directly with local farmers to bring you the freshest,
              most sustainably grown produce. Our commitment to organic farming
              practices and eco-friendly packaging helps reduce our
              environmental footprint.
            </p>
            <ul className="space-y-3 pt-4">
              {features.map((text, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 items-center text-gray-700 dark:text-gray-200"
                >
                  <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/product-list"
            className="relative h-64 md:h-96 overflow-hidden rounded-xl"
          >
            <div className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src="https://i.pinimg.com/originals/54/a3/0a/54a30a865f8ff12f31f1d07d616f6d44.jpg"
                alt="Organic farming"
                className="block w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent pointer-events-none" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
