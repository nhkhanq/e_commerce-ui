import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/shared/header";
import Login from "./pages/Login";
import LoadingPage from "./components/loading";
import NotFoundPage from "./components/not-found";
import Home from "./pages/home";
import ProductDetail from "./pages/product/product-detail";

//product
import ProductList from "./pages/product/product-list";

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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Catch all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
