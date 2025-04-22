import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/shared/header";
import Login from "./pages/Login";
import LoadingPage from "./components/loading";
import NotFoundPage from "./components/not-found";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/not-found" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
