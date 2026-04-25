/**
 * @file middleware/error.ts
 * @description Middleware Oak de gestion globale des erreurs non interceptées.
 */

import type { Context, Next } from "@oak/oak";

/**
 * Intercepte toute exception levée dans les middlewares suivants et renvoie
 * une réponse JSON `500` standardisée plutôt que de laisser Oak exposer
 * le message d'erreur brut au client.
 *
 * @param ctx - Contexte Oak de la requête en cours.
 * @param next - Prochain middleware dans la chaîne.
 *
 * @example
 * ```ts
 * app.use(errorMiddleware);
 * app.use(router.routes());
 * ```
 */
export async function errorMiddleware(ctx: Context, next: Next): Promise<void> {
  try {
    await next();
  } catch (err) {
    console.error("[API]", err);
    ctx.response.status = 500;
    ctx.response.body = { ok: false, error: "Erreur interne du serveur." };
  }
}
