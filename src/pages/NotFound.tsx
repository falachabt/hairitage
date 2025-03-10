
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-plum-50 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-plum-700 mb-4">404</h1>
          <p className="text-xl text-plum-900 mb-6">
            Oops! La page que vous recherchez semble avoir disparu
          </p>
          <p className="text-muted-foreground mb-8">
            La page que vous essayez d'atteindre n'existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/products">Voir nos produits</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
