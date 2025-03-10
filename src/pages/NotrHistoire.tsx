
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotreHistoire = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 pt-28">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Notre Histoire</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl">
              Depuis notre fondation en 2015, Hairitage s'est donné pour mission de célébrer la beauté authentique et la diversité des cheveux à travers nos collections de perruques de haute qualité.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Nos Débuts</h2>
            <p>
              Hairitage a commencé comme un petit atelier à Paris, fondé par Marie Dupont, styliste passionnée qui avait identifié un manque de perruques de qualité supérieure sur le marché français. Suite à une expérience personnelle avec un membre de sa famille qui suivait un traitement contre le cancer, Marie a décidé de créer une marque qui offrirait des solutions capillaires à la fois esthétiques et confortables.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Notre Vision</h2>
            <p>
              Chez Hairitage, nous croyons que chaque personne mérite de se sentir belle et confiante. Nos produits sont conçus avec le plus grand soin, en utilisant des matériaux de première qualité pour garantir un aspect naturel et un confort optimal. Notre engagement envers l'excellence se reflète dans chaque perruque que nous créons.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Notre Engagement</h2>
            <p>
              Nous nous engageons à:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utiliser des matériaux éthiques et durables</li>
              <li>Offrir une expérience d'achat personnalisée</li>
              <li>Soutenir les associations d'aide aux personnes souffrant de perte de cheveux</li>
              <li>Fournir des conseils d'entretien et un service après-vente exemplaire</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Notre Équipe</h2>
            <p>
              Aujourd'hui, Hairitage compte une équipe de 15 professionnels dévoués, incluant des stylistes capillaires, des spécialistes en matériaux, des conseillers beauté et des experts en service client. Ensemble, nous travaillons pour offrir les meilleures solutions capillaires à notre clientèle fidèle.
            </p>
            
            <div className="my-12 text-center italic">
              "La beauté n'est pas une question de conformité, mais d'authenticité et de confiance en soi." — Marie Dupont, Fondatrice
            </div>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Rejoignez la Famille Hairitage</h2>
            <p>
              Nous vous invitons à découvrir nos collections et à faire partie de notre histoire en constante évolution. Chez Hairitage, vous n'êtes pas simplement un client – vous faites partie de notre famille.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotreHistoire;
