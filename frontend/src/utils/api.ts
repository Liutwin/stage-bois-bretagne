/**
 * @file utils/api.ts
 * @description Fonctions utilitaires pour communiquer avec le backend Deno/Oak.
 * Toutes les requêtes passent par le préfixe `/api` intercepté par le reverse proxy Nginx.
 */

import type { ApiResponse, Session, SessionPayload } from '@/types/session';

/** URL de base de l'API. En développement, Vite proxifie vers `http://localhost:8001`. */
const API_BASE = '/api';

/**
 * Récupère les données du prochain stage affiché sur le site public.
 *
 * @returns La session active, ou `null` si aucun stage n'est programmé.
 * @throws {Error} En cas d'erreur réseau ou de réponse HTTP non-OK.
 *
 * @example
 * ```ts
 * const session = await fetchNextSession();
 * if (session) {
 *   console.log(session.theme);
 * }
 * ```
 */
export async function fetchNextSession(): Promise<Session | null> {
  const res = await fetch(`${API_BASE}/session`);
  if (!res.ok) {
    throw new Error(`Erreur API : ${res.status} ${res.statusText}`);
  }
  const body: ApiResponse<Session> = await res.json();
  return body.data ?? null;
}

/**
 * Met à jour les informations du prochain stage via l'interface d'administration.
 * Cette route est protégée par HTTP Basic Auth au niveau de Nginx.
 *
 * @param payload - Données mises à jour de la session.
 * @returns La session mise à jour.
 * @throws {Error} En cas d'erreur réseau, de réponse HTTP non-OK ou de rejet métier.
 */
export async function updateSession(payload: SessionPayload): Promise<Session> {
  const res = await fetch(`${API_BASE}/admin/session`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body: ApiResponse<never> = await res.json().catch(() => ({ ok: false, error: res.statusText }));
    throw new Error(body.error ?? `Erreur API : ${res.status}`);
  }
  const body: ApiResponse<Session> = await res.json();
  if (!body.data) throw new Error('Réponse inattendue du serveur.');
  return body.data;
}

/**
 * Envoie un message de contact via le backend.
 *
 * @param data - Données du formulaire de contact.
 * @throws {Error} En cas d'erreur d'envoi.
 */
export async function sendContactMessage(data: {
  fullName: string;
  email: string;
  phone?: string;
  sessionId?: number;
  message: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body: ApiResponse<never> = await res.json().catch(() => ({ ok: false, error: res.statusText }));
    throw new Error(body.error ?? `Erreur API : ${res.status}`);
  }
}
