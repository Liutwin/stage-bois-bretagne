/**
 * @file types/session.ts
 * @description Définitions des types TypeScript pour le module "prochain stage".
 */

/**
 * Représente les données d'une session de stage telles que renvoyées par l'API.
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
  /** Identifiant unique de la session (clé primaire SQLite). */
  id: number;
  /** Thème ou intitulé court du stage. */
  theme: string;
  /** Date de début au format ISO 8601 (YYYY-MM-DD). */
  startDate: string;
  /** Date de fin au format ISO 8601 (YYYY-MM-DD). */
  endDate: string;
  /** Nombre de places encore disponibles. */
  spotsAvailable: number;
  /** Capacité totale du stage. */
  totalSpots: number;
  /** Indique si la session est affichée sur le site public. */
  isVisible: boolean;
  /** Court texte de présentation du stage (facultatif). */
  description: string;
}

/**
 * Charge utile envoyée au backend pour créer ou mettre à jour une session.
 * Identique à {@link Session} sans le champ `id`.
 */
export type SessionPayload = Omit<Session, 'id'>;

/**
 * Réponse générique de l'API backend.
 *
 * @template T - Type de la donnée encapsulée dans `data`.
 */
export interface ApiResponse<T> {
  /** Indique si la requête s'est terminée avec succès. */
  ok: boolean;
  /** Données renvoyées par le serveur en cas de succès. */
  data?: T;
  /** Message d'erreur descriptif en cas d'échec. */
  error?: string;
}

/**
 * Avis Google Places tel que renvoyé par l'API Google.
 */
export interface GoogleReview {
  /** Nom de l'auteur de l'avis. */
  authorName: string;
  /** URL vers la photo de profil de l'auteur. */
  profilePhotoUrl: string;
  /** Note de l'avis, de 1 à 5. */
  rating: number;
  /** Texte de l'avis. */
  text: string;
  /** Date de publication relative (ex : "il y a 2 mois"). */
  relativeTimeDescription: string;
}

/**
 * Données agrégées provenant de la fiche Google Places.
 */
export interface PlaceDetails {
  /** Note moyenne globale de l'établissement. */
  rating: number;
  /** Nombre total d'avis. */
  userRatingsTotal: number;
  /** Liste des derniers avis (jusqu'à 5). */
  reviews: GoogleReview[];
}

/**
 * Données du formulaire de contact.
 */
export interface ContactFormData {
  /** Prénom et nom du visiteur. */
  fullName: string;
  /** Adresse email de contact. */
  email: string;
  /** Numéro de téléphone (facultatif). */
  phone?: string;
  /** Identifiant de la session souhaitée. */
  sessionId?: number;
  /** Message libre. */
  message: string;
}
