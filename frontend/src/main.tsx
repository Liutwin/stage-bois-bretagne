/**
 * @file main.tsx
 * @description Point d'entrée principal de l'application publique Stage Bois Bretagne.
 * Monte le routeur React et enregistre les feuilles de style globales.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/globals.css';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { StagePage } from '@/pages/StagePage';
import { NextSessionPage } from '@/pages/NextSessionPage';
import { TarifsPage } from '@/pages/TarifsPage';
import { HebergementPage } from '@/pages/HebergementPage';
import { FormatricePage } from '@/pages/FormatricePage';
import { PartenairesPage } from '@/pages/PartenairesPage';
import { ContactPage } from '@/pages/ContactPage';

const root = document.getElementById('root');
if (!root) throw new Error('Element #root introuvable dans le DOM.');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stage" element={<StagePage />} />
        <Route path="/prochain-stage" element={<NextSessionPage />} />
        <Route path="/tarifs" element={<TarifsPage />} />
        <Route path="/hebergement" element={<HebergementPage />} />
        <Route path="/formatrice" element={<FormatricePage />} />
        <Route path="/partenaires" element={<PartenairesPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
);
