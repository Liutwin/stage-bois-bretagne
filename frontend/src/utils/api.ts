/**
 * @file utils/api.ts
 * @description Fonctions utilitaires pour communiquer avec le backend Deno/Oak.
 * Toutes les requêtes passent par le préfixe `/api` intercepté par le reverse proxy Nginx.
 */

import type { ApiResponse, Session, SessionPayload, Testimonial, PlaceRating } from '@/types/session';


/** URL de base de l'API. En développement, Vite proxifie vers `http://localhost:8001`. */
const API_BASE = '/api';

const ADMIN_TOKEN_KEY = 'admin_token';

export function getAdminToken(): string {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? '';
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

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

/** Récupère toutes les sessions visibles pour le site public. */
export async function fetchPublicSessions(): Promise<Session[]> {
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) throw new Error(`Erreur API : ${res.status} ${res.statusText}`);
  const body: ApiResponse<Session[]> = await res.json();
  return body.data ?? [];
}

/** Récupère toutes les sessions pour le panneau d'administration. */
export async function fetchAllAdminSessions(): Promise<Session[]> {
  const res = await fetch(`${API_BASE}/admin/sessions`, {
    headers: { 'Authorization': `Bearer ${getAdminToken()}` },
  });
  if (!res.ok) throw new Error(`Erreur API : ${res.status} ${res.statusText}`);
  const body: ApiResponse<Session[]> = await res.json();
  return body.data ?? [];
}

/**
 * Met à jour les informations du prochain stage via l'interface d'administration.
 * Cette route est protégée par HTTP Basic Auth au niveau de Nginx.
 *
 * @param payload - Données mises à jour de la session.
 * @returns La session mise à jour.
 * @throws {Error} En cas d'erreur réseau, de réponse HTTP non-OK ou de rejet métier.
 */
/**
 * Vérifie que le mot de passe admin est correct auprès du backend.
 * @throws {Error} Si le mot de passe est incorrect ou en cas d'erreur réseau.
 */
export async function verifyAdminPassword(password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/verify`, {
    headers: { 'Authorization': `Bearer ${password}` },
  });
  if (!res.ok) {
    throw new Error('Mot de passe incorrect.');
  }
}

export async function updateSession(payload: SessionPayload): Promise<Session> {
  const res = await fetch(`${API_BASE}/admin/session`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAdminToken()}`,
    },
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

/** Récupère les 3 témoignages pour la page d'accueil. */
export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${API_BASE}/testimonials`);
  if (!res.ok) throw new Error(`Erreur API : ${res.status}`);
  const body: ApiResponse<Testimonial[]> = await res.json();
  return body.data ?? [];
}

/** Met à jour un témoignage (admin). */
export async function updateTestimonial(payload: Testimonial): Promise<Testimonial> {
  const res = await fetch(`${API_BASE}/admin/testimonial`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAdminToken()}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body: ApiResponse<never> = await res.json().catch(() => ({ ok: false, error: res.statusText }));
    throw new Error(body.error ?? `Erreur API : ${res.status}`);
  }
  const body: ApiResponse<Testimonial> = await res.json();
  if (!body.data) throw new Error('Réponse inattendue du serveur.');
  return body.data;
}

/** Récupère la note globale Google Places (peut renvoyer null si non configuré). */
export async function fetchPlaceRating(): Promise<PlaceRating | null> {
  const res = await fetch(`${API_BASE}/place-rating`);
  if (!res.ok) return null;
  const body: ApiResponse<PlaceRating> & { reviewUrl?: string | null } = await res.json();
  if (!body.data && !body.reviewUrl) return null;
  return {
    rating: body.data?.rating ?? 0,
    userRatingsTotal: body.data?.userRatingsTotal ?? 0,
    reviewUrl: body.reviewUrl ?? null,
  };
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
