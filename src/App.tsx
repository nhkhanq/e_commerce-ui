import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Footer from "./components/footer";
import Header from "./components/shared/header";
import LoadingPage from "./components/loading";
import ErrorFallback from "./components/shared/ErrorBoundary";
import AppRouter from "./routers/AppRouter";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setHasError(false);
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const resetError = () => {
    setHasError(false);
  };

  if (hasError) {
    return (
      <ErrorFallback
        error={new Error("An unexpected error occurred")}
        resetErrorBoundary={resetError}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
