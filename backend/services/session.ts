/**
 * @file services/session.ts
 * @description Couche d'accès aux données pour la table `sessions`.
 */

import { db } from "../config/db.ts";
import type { Session, SessionPayload, SessionRow, StageType } from "../model/interfaces.ts";
import { STAGE_LABELS } from "../model/interfaces.ts";

function toSession(row: SessionRow): Session {
  return {
    id:             row.id,
    type:           (row.type ?? 'initiation') as StageType,
    theme:          row.theme,
    startDate:      row.start_date,
    endDate:        row.end_date,
    spotsAvailable: row.spots_available,
    totalSpots:     row.total_spots,
    isVisible:      row.is_visible === 1,
    description:    row.description ?? '',
  };
}

/** Retourne toutes les sessions (une par type), triées par id. */
export function getAllSessions(): Session[] {
  const rows = db.prepare("SELECT * FROM sessions ORDER BY id ASC").all() as SessionRow[];
  return rows.map(toSession);
}

/** Retourne la session visible la plus récente, ou `null` si aucune n'est publiée. */
export function getVisibleSession(): Session | null {
  const row = db
    .prepare("SELECT * FROM sessions WHERE is_visible = 1 ORDER BY id DESC LIMIT 1")
    .get() as SessionRow | undefined;
  return row ? toSession(row) : null;
}

/** Retourne la session la plus récente quelle que soit sa visibilité. */
export function getLatestSession(): Session | null {
  const row = db
    .prepare("SELECT * FROM sessions ORDER BY id DESC LIMIT 1")
    .get() as SessionRow | undefined;
  return row ? toSession(row) : null;
}

/**
 * Crée ou met à jour la session correspondant au type donné.
 * Le `theme` est dérivé automatiquement du `type`.
 */
export function upsertSession(payload: SessionPayload): Session {
  const theme    = STAGE_LABELS[payload.type];
  const existing = db
    .prepare("SELECT id FROM sessions WHERE type = ?")
    .get(payload.type) as { id: number } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE sessions
       SET theme=?, start_date=?, end_date=?, spots_available=?, total_spots=?, is_visible=?, description=?
       WHERE type=?`,
    ).run(
      theme,
      payload.startDate,
      payload.endDate,
      payload.spotsAvailable,
      payload.totalSpots,
      payload.isVisible ? 1 : 0,
      payload.description ?? '',
      payload.type,
    );
    return { id: existing.id, theme, ...payload };
  }

  const result = db.prepare(
    `INSERT INTO sessions (type, theme, start_date, end_date, spots_available, total_spots, is_visible, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    payload.type,
    theme,
    payload.startDate,
    payload.endDate,
    payload.spotsAvailable,
    payload.totalSpots,
    payload.isVisible ? 1 : 0,
    payload.description ?? '',
  );
  return { id: Number(result.lastInsertRowid), theme, ...payload };
}
