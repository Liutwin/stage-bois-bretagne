/**
 * @file routes/session.ts
 * @description Routes Oak relatives à la gestion du stage.
 *
 * | Méthode | Chemin               | Accès      | Description                          |
 * |---------|----------------------|------------|--------------------------------------|
 * | GET     | /api/session         | Public     | Récupère la session visible           |
 * | PUT     | /api/admin/session   | Admin (*)  | Crée ou met à jour la session         |
 *
 * (*) Protégé par HTTP Basic Auth au niveau de Nginx en production.
 */

import { Router } from "@oak/oak";
import { getVisibleSession, getLatestSession, upsertSession } from "../services/session.ts";
import { adminAuthMiddleware } from "../middleware/auth.ts";
import type { SessionPayload } from "../model/interfaces.ts";

const router = new Router({ prefix: "/api" });

/**
 * `GET /api/session`
 *
 * Retourne la session de stage actuellement publiée sur le site public.
 * Répond toujours `200` : `data` est absent si aucun stage n'est visible.
 */
router.get("/session", (ctx) => {
  const session = getVisibleSession();
  const latest = getLatestSession();
  const potentialDates = latest?.description || null;
  ctx.response.body = {
    ok: true,
    ...(session ? { data: session } : {}),
    ...(potentialDates ? { potentialDates } : {}),
  };
});

/**
 * `GET /api/admin/verify`
 *
 * Vérifie que le token Bearer fourni est valide.
 * - `200` – Token valide.
 * - `401` – Token absent ou incorrect.
 */
router.get("/admin/verify", adminAuthMiddleware, (ctx) => {
  ctx.response.body = { ok: true };
});

/**
 * `PUT /api/admin/session`
 *
 * Crée ou met à jour la session de stage (upsert).
 * Tous les champs de {@link SessionPayload} sont obligatoires.
 *
 * Réponses possibles :
 * - `200` – Session mise à jour, retourne la session complète avec son `id`.
 * - `400` – Corps JSON invalide ou champs manquants/mal typés.
 * - `401` – Token d'authentification absent ou incorrect.
 */
router.put("/admin/session", adminAuthMiddleware, async (ctx) => {
  let body: Record<string, unknown>;
  try {
    body = await ctx.request.body.json();
  } catch {
    ctx.response.status = 400;
    ctx.response.body = { ok: false, error: "Corps de requête JSON invalide." };
    return;
  }

  const { theme, startDate, endDate, spotsAvailable, totalSpots, isVisible, description } =
    body as Partial<SessionPayload>;

  if (
    typeof theme !== "string" || !theme ||
    typeof startDate !== "string" || !startDate ||
    typeof endDate !== "string" || !endDate ||
    typeof spotsAvailable !== "number" ||
    typeof totalSpots !== "number" ||
    typeof isVisible !== "boolean"
  ) {
    ctx.response.status = 400;
    ctx.response.body = { ok: false, error: "Champs manquants ou invalides." };
    return;
  }

  const session = upsertSession({ theme, startDate, endDate, spotsAvailable, totalSpots, isVisible, description: description ?? '' });
  ctx.response.body = { ok: true, data: session };
});

export default router;
