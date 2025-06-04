import { useState } from "react";
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

const MailIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  return (
    <section className="w-full py-16 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex p-2 mb-6 rounded-full bg-green-100 dark:bg-green-800/40">
            <MailIcon className="h-6 w-6 text-green-700 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl mb-4">
            Stay Updated with Green Deals
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates on seasonal products,
            exclusive offers, and organic farming tips directly to your inbox.
          </p>

          {isSubscribed ? (
            <div className="p-4 bg-green-200 dark:bg-green-800/70 rounded-lg mb-6 inline-block">
              <p className="text-green-800 dark:text-green-200 font-medium flex items-center gap-2">
                <CheckIcon className="h-5 w-5" />
                Thank you for subscribing!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-200 flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
