import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-text-dark text-background py-8 text-center border-t border-primary-dark">
      <div className="container mx-auto px-4">
        <p className="text-lg font-semibold mb-2">
          Ce site est un projet préliminaire 🚀
        </p>
        <p className="text-neutral-light mb-4 max-w-2xl mx-auto">
          Il a pour but de donner un aperçu du futur site "LuxeStyle".
          Prochainement, nous prévoyons d'établir des partenariats avec des commerces locaux de luxe
          pour intégrer des services de livraison et une carte interactive des magasins de proximité.
        </p>
        <p className="text-neutral-medium text-sm">
          © {new Date().getFullYear()} LuxeStyle. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;