
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import UserProfile from "./pages/UserProfile";
import NotreHistoire from "./pages/NotrHistoire";
import EmailConfirmation from "./pages/EmailConfirmation";
import EmailConfirmed from "./pages/EmailConfirmed";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <div className="flex flex-col min-h-screen overflow-x-hidden">
                <Toaster />
                <Sonner />
                <div className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:productId" element={<ProductDetail />} />
                    <Route path="/category/:categoryId" element={<CategoryPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/notre-histoire" element={<NotreHistoire />} />
                    <Route path="/email-confirmation" element={<EmailConfirmation />} />
                    <Route path="/email-confirmed" element={<EmailConfirmed />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
