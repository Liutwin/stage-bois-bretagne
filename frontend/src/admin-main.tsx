/**
 * @file admin-main.tsx
 * @description Point d'entrée de l'interface d'administration.
 * Servi via `admin.html` — protégé par authentification Bearer token.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/globals.css';
import { AdminPage } from '@/pages/AdminPage';

const root = document.getElementById('admin-root');
if (!root) throw new Error('Element #admin-root introuvable dans le DOM.');

// Log de debug
console.log('[Admin] Initialisation…');

try {
  createRoot(root).render(
    <StrictMode>
      <AdminPage />
    </StrictMode>,
  );
  console.log('[Admin] Rendu réussi.');
} catch (err) {
  console.error('[Admin] Erreur lors du rendu :', err);
  root.innerHTML = `<p style="color:red; padding:2rem;">Erreur : ${err instanceof Error ? err.message : String(err)}</p>`;
}
