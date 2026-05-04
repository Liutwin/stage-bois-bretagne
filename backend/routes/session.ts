/**
 * @file routes/session.ts
 * @description Routes Oak relatives à la gestion des stages.
 *
 * | Méthode | Chemin                  | Accès  | Description                              |
 * |---------|-------------------------|--------|------------------------------------------|
 * | GET     | /api/session            | Public | Session visible (site public)            |
 * | GET     | /api/admin/sessions     | Admin  | Toutes les sessions (panneau admin)      |
 * | GET     | /api/admin/verify       | Admin  | Vérifie le token Bearer                  |
 * | PUT     | /api/admin/session      | Admin  | Crée ou met à jour une session par type  |
 */

import { Router } from "@oak/oak";
import { getAllSessions, getVisibleSession, getLatestSession, upsertSession } from "../services/session.ts";
import { adminAuthMiddleware } from "../middleware/auth.ts";
import type { SessionPayload, StageType } from "../model/interfaces.ts";

const VALID_TYPES: StageType[] = ['initiation', 'jouets', 'perfectionnement'];

const router = new Router({ prefix: "/api" });

/** `GET /api/session` — session visible pour le site public. */
router.get("/session", (ctx) => {
  const session      = getVisibleSession();
  const latest       = getLatestSession();
  const potentialDates = latest?.description || null;
  ctx.response.body = {
    ok: true,
    ...(session        ? { data: session }               : {}),
    ...(potentialDates ? { potentialDates }              : {}),
  };
});

/** `GET /api/sessions` — toutes les sessions (site public, inclut les non-visibles pour les commentaires). */
router.get("/sessions", (ctx) => {
  ctx.response.body = { ok: true, data: getAllSessions() };
});

/** `GET /api/admin/sessions` — toutes les sessions pour le panneau d'administration. */
router.get("/admin/sessions", adminAuthMiddleware, (ctx) => {
  ctx.response.body = { ok: true, data: getAllSessions() };
});

/** `GET /api/admin/verify` — vérifie la validité du token Bearer. */
router.get("/admin/verify", adminAuthMiddleware, (ctx) => {
  ctx.response.body = { ok: true };
});

/** `PUT /api/admin/session` — crée ou met à jour une session par type (upsert). */
router.put("/admin/session", adminAuthMiddleware, async (ctx) => {
  let body: Record<string, unknown>;
  try {
    body = await ctx.request.body.json();
  } catch {
    ctx.response.status = 400;
    ctx.response.body = { ok: false, error: "Corps de requête JSON invalide." };
    return;
  }

  const { type, startDate, endDate, spotsAvailable, totalSpots, isVisible, description } =
    body as Partial<SessionPayload>;

  if (
    !type || !VALID_TYPES.includes(type) ||
    typeof startDate !== "string" || !startDate ||
    typeof endDate   !== "string" || !endDate   ||
    typeof spotsAvailable !== "number" ||
    typeof totalSpots     !== "number" ||
    typeof isVisible      !== "boolean"
  ) {
    ctx.response.status = 400;
    ctx.response.body = { ok: false, error: "Champs manquants ou invalides." };
    return;
  }

  const session = upsertSession({
    type, startDate, endDate, spotsAvailable, totalSpots, isVisible,
    description: description ?? '',
  });
  ctx.response.body = { ok: true, data: session };
});

export default router;
