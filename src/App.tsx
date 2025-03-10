
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import { FavoritesProvider } from "@/hooks/use-favorites";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <FavoritesProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
