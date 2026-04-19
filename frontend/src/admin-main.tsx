/**
 * @file admin-main.tsx
 * @description Point d'entrée de l'interface d'administration.
 * Servi via `admin.html` — protégé par HTTP Basic Auth Nginx.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/globals.css';
import { AdminPage } from '@/pages/AdminPage';

const root = document.getElementById('admin-root');
if (!root) throw new Error('Element #admin-root introuvable dans le DOM.');

createRoot(root).render(
  <StrictMode>
    <AdminPage />
  </StrictMode>,
);
