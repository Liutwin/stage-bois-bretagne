/**
 * @file services/session.ts
 * @description Couche d'accès aux données pour la table `sessions`.
 * Toutes les interactions avec SQLite passent par ce module.
 */

import { db } from "../config/db.ts";
import type { Session, SessionPayload, SessionRow } from "../model/interfaces.ts";

/**
 * Convertit une ligne SQLite (snake_case) en objet {@link Session} (camelCase).
 *
 * @param row - Ligne brute issue de la table `sessions`.
 * @returns Session formatée pour l'API.
 */
function toSession(row: SessionRow): Session {
  return {
    id: row.id,
    theme: row.theme,
    startDate: row.start_date,
    endDate: row.end_date,
    spotsAvailable: row.spots_available,
    totalSpots: row.total_spots,
    isVisible: row.is_visible === 1,
  };
}

/**
 * Récupère la session actuellement visible sur le site public.
 * Si plusieurs sessions sont marquées `is_visible = 1`, la plus récente est retournée.
 *
 * @returns La session visible, ou `null` si aucune n'est publiée.
 */
export function getVisibleSession(): Session | null {
  const row = db
    .prepare("SELECT * FROM sessions WHERE is_visible = 1 ORDER BY id DESC LIMIT 1")
    .get() as SessionRow | undefined;
  return row ? toSession(row) : null;
}

/**
 * Crée ou met à jour la session de stage.
 *
 * - S'il existe déjà une session en base, elle est mise à jour (`UPDATE`).
 * - Sinon, une nouvelle session est insérée (`INSERT`).
 *
 * Ce comportement "upsert" repose sur l'hypothèse qu'un seul stage est géré à la fois.
 *
 * @param payload - Données du stage sans l'`id` (fourni ou généré par SQLite).
 * @returns La session résultante avec son `id`.
 */
export function upsertSession(payload: SessionPayload): Session {
  const existing = db
    .prepare("SELECT id FROM sessions ORDER BY id DESC LIMIT 1")
    .get() as { id: number } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE sessions
       SET theme=?, start_date=?, end_date=?, spots_available=?, total_spots=?, is_visible=?
       WHERE id=?`,
    ).run(
      payload.theme,
      payload.startDate,
      payload.endDate,
      payload.spotsAvailable,
      payload.totalSpots,
      payload.isVisible ? 1 : 0,
      existing.id,
    );
    return { id: existing.id, ...payload };
  }

  const result = db.prepare(
    `INSERT INTO sessions (theme, start_date, end_date, spots_available, total_spots, is_visible)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    payload.theme,
    payload.startDate,
    payload.endDate,
    payload.spotsAvailable,
    payload.totalSpots,
    payload.isVisible ? 1 : 0,
  );
  return { id: Number(result.lastInsertRowid), ...payload };
}
