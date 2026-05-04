/**
 * @file model/interfaces.ts
 * @description Définitions des types et interfaces partagés entre les routes, services et la couche BDD.
 */

/** Identifiant de type de stage. */
export type StageType = 'initiation' | 'jouets' | 'perfectionnement';

/** Libellés affichés pour chaque type de stage. */
export const STAGE_LABELS: Record<StageType, string> = {
  initiation:       "Week-end d'initiation",
  jouets:           "Journée de fabrication d'un jouet",
  perfectionnement: "Journée de perfectionnement",
};

/**
 * Représente un stage tel qu'exposé par l'API publique.
 */
export interface Session {
  /** Identifiant unique (clé primaire SQLite). */
  id: number;
  /** Type de stage. */
  type: StageType;
  /** Intitulé dérivé automatiquement du type. */
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
  /** Court texte de présentation du stage (facultatif). */
  description: string;
}

/**
 * Charge utile envoyée au backend pour créer ou mettre à jour un stage.
 * `theme` est exclu : il est dérivé automatiquement du `type` côté backend.
 */
export type SessionPayload = Omit<Session, 'id' | 'theme'>;

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
 * Données envoyées au backend lors de la génération du bulletin d'inscription.
 */
export interface InscriptionEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  level?: string;
  dateOfBirth?: string;
  profession?: string;
  comment?: string;
  sessionId?: number;
  /** Contenu du PDF encodé en base64 (sans préfixe data URI). */
  pdfBase64: string;
  /** Nom de fichier suggéré pour la pièce jointe. */
  filename: string;
}

/**
 * Enveloppe générique des réponses JSON de l'API.
 * @template T - Type de la donnée encapsulée dans `data`.
 */
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

/**
 * Représentation interne d'une ligne de la table `sessions` (champs en snake_case).
 * @internal
 */
export interface SessionRow {
  id: number;
  type: string;
  theme: string;
  start_date: string;
  end_date: string;
  spots_available: number;
  total_spots: number;
  /** Stocké en `0`/`1` en SQLite ; converti en `boolean` par {@link Session}. */
  is_visible: number;
  description: string;
}
