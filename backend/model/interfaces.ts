/**
 * @file model/interfaces.ts
 * @description Définitions des types et interfaces partagés entre les routes, services et la couche BDD.
 */

/**
 * Représente un stage tel qu'exposé par l'API publique.
 *
 * @example
 * ```ts
 * const session: Session = {
 *   id: 1,
 *   theme: "Jouets & Découpes",
 *   startDate: "2025-09-15",
 *   endDate: "2025-09-17",
 *   spotsAvailable: 2,
 *   totalSpots: 4,
 *   isVisible: true,
 * };
 * ```
 */
export interface Session {
  /** Identifiant unique (clé primaire SQLite). */
  id: number;
  /** Intitulé court du stage (ex. : "Jouets & Découpes"). */
  theme: string;
  /** Date de début au format ISO 8601 (`YYYY-MM-DD`). */
  startDate: string;
  /** Date de fin au format ISO 8601 (`YYYY-MM-DD`). */
  endDate: string;
  /** Nombre de places encore disponibles. */
  spotsAvailable: number;
  /** Capacité totale du stage. */
  totalSpots: number;
  /** Indique si le stage est affiché sur le site public. */
  isVisible: boolean;
}

/**
 * Charge utile envoyée au backend pour créer ou mettre à jour un stage.
 * Identique à {@link Session} sans le champ `id` (attribué par la BDD).
 */
export type SessionPayload = Omit<Session, "id">;

/**
 * Données du formulaire de contact soumis par un visiteur.
 */
export interface ContactFormData {
  /** Prénom et nom du visiteur. */
  fullName: string;
  /** Adresse email de contact. */
  email: string;
  /** Numéro de téléphone (facultatif). */
  phone?: string;
  /** Identifiant de la session souhaitée (facultatif). */
  sessionId?: number;
  /** Message libre du visiteur. */
  message: string;
}

/**
 * Enveloppe générique des réponses JSON de l'API.
 *
 * @template T - Type de la donnée encapsulée dans `data`.
 *
 * @example
 * ```ts
 * // Succès
 * const ok: ApiResponse<Session> = { ok: true, data: session };
 * // Erreur
 * const err: ApiResponse<never> = { ok: false, error: "Non trouvé." };
 * ```
 */
export interface ApiResponse<T> {
  /** `true` si la requête s'est terminée avec succès. */
  ok: boolean;
  /** Données renvoyées par le serveur en cas de succès. */
  data?: T;
  /** Message d'erreur descriptif en cas d'échec. */
  error?: string;
}

/**
 * Représentation interne d'une ligne de la table `sessions` (champs en snake_case).
 * Utilisée uniquement par la couche service pour mapper les résultats SQLite.
 *
 * @internal
 */
export interface SessionRow {
  id: number;
  theme: string;
  start_date: string;
  end_date: string;
  spots_available: number;
  total_spots: number;
  /** Stocké en `0`/`1` en SQLite ; converti en `boolean` par {@link Session}. */
  is_visible: number;
}
