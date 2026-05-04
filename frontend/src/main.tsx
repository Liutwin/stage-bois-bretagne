/**
 * @file main.tsx
 * @description Point d'entrée principal de l'application publique Stage Bois Bretagne.
 * Monte le routeur React et enregistre les feuilles de style globales.
 */

import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import '@/globals.css';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { StagePage } from '@/pages/StagePage';
import { InscriptionPage } from '@/pages/InscriptionPage';
import { FormulesPage } from '@/pages/FormulesPage';
import { HebergementPage } from '@/pages/HebergementPage';
import { FormatricePage } from '@/pages/FormatricePage';
import { ContactPage } from '@/pages/ContactPage';
import { PressePage } from '@/pages/PressePage';
import { MentionsLegalesPage } from '@/pages/MentionsLegalesPage';
import { PolitiqueConfidentialitePage } from '@/pages/PolitiqueConfidentialitePage';

const root = document.getElementById('root');
if (!root) throw new Error('Element #root introuvable dans le DOM.');

createRoot(root).render(
  <StrictMode>
    <HelmetProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stage" element={<StagePage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/formules" element={<FormulesPage />} />
        <Route path="/hebergement" element={<HebergementPage />} />
        <Route path="/formatrice" element={<FormatricePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/presse" element={<PressePage />} />
        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialitePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
