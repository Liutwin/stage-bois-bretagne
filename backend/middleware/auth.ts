/**
 * @file middleware/auth.ts
 * @description Middleware Oak d'authentification des routes d'administration.
 *
 * L'interface d'administration envoie le mot de passe dans l'en-tête
 * `Authorization: Bearer <mot de passe>`. Le middleware le compare à la variable
 * d'environnement `ADMIN_PASSWORD` et bloque temporairement une adresse IP
 * après plusieurs échecs, pour empêcher les tentatives de mot de passe en boucle.
 *
 * Seuls les échecs sont comptés : la formatrice peut utiliser le panneau
 * d'administration autant qu'elle le souhaite une fois connectée.
 */

import type { Context, Next } from "@oak/oak";
import { timingSafeEqual } from "jsr:@std/crypto/timing-safe-equal";

/** Nombre d'échecs tolérés par adresse IP avant blocage. */
const MAX_FAILS = 5;

/** Durée de la fenêtre de comptage, et donc du blocage (15 minutes). */
const WINDOW_MS = 15 * 60 * 1000;

/**
 * Compteur d'échecs par adresse IP, conservé en mémoire.
 * Il est remis à zéro au redémarrage du conteneur, ce qui suffit pour un site
 * à une seule instance.
 */
const fails = new Map<string, { count: number; resetAt: number }>();

const enc = new TextEncoder();

/**
 * Retourne l'adresse IP réelle du client.
 *
 * Le backend se trouve derrière deux proxys (Nginx de l'hôte, puis Nginx du
 * conteneur frontend). Seul `X-Real-IP`, fixé par le Nginx de l'hôte et
 * transmis tel quel par celui du conteneur, est fiable. `X-Forwarded-For`
 * n'est pas utilisé, car le client peut y injecter n'importe quelle valeur.
 */
function clientIp(ctx: Context): string {
  return ctx.request.headers.get("x-real-ip") ?? ctx.request.ip ?? "unknown";
}

/**
 * Vérifie le mot de passe d'administration avant de passer la main à la route.
 *
 * Réponses possibles :
 * - 500 si `ADMIN_PASSWORD` n'est pas défini (erreur de configuration) ;
 * - 429 si l'adresse IP a dépassé le nombre d'échecs autorisés ;
 * - 401 si le mot de passe est absent ou incorrect ;
 * - sinon, la requête continue vers la route protégée.
 */
export async function adminAuthMiddleware(ctx: Context, next: Next) {
  const password = Deno.env.get("ADMIN_PASSWORD");

  // Sans mot de passe configuré, on refuse tout plutôt que d'ouvrir l'administration.
  if (!password) {
    ctx.response.status = 500;
    ctx.response.body = { ok: false, error: "Configuration serveur invalide." };
    return;
  }

  const ip = clientIp(ctx);
  const now = Date.now();
  const entry = fails.get(ip);

  // IP bloquée : on répond 429 avant même de vérifier le mot de passe,
  // pour qu'aucune tentative supplémentaire ne soit évaluée pendant le blocage.
  if (entry && now < entry.resetAt && entry.count >= MAX_FAILS) {
    ctx.response.status = 429;
    ctx.response.headers.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
    ctx.response.body = { ok: false, error: "Trop de tentatives. Réessayez plus tard." };
    return;
  }

  // Extraction du mot de passe depuis l'en-tête « Authorization: Bearer … ».
  const auth = ctx.request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  // Comparaison à temps constant : avec un simple `!==`, la durée de la
  // comparaison varie selon le nombre de premiers caractères corrects, ce qui
  // pourrait en théorie aider à deviner le mot de passe caractère par caractère.
  // `timingSafeEqual` exige deux tableaux de même longueur, d'où le test préalable.
  const a = enc.encode(token);
  const b = enc.encode(password);
  const ok = a.length === b.length && timingSafeEqual(a, b);

  if (!ok) {
    // On repart d'un compteur neuf si la fenêtre précédente a expiré.
    const e = entry && now < entry.resetAt ? entry : { count: 0, resetAt: now + WINDOW_MS };
    e.count++;
    fails.set(ip, e);
    ctx.response.status = 401;
    ctx.response.body = { ok: false, error: "Non autorisé." };
    return;
  }

  // Connexion réussie : on efface les échecs précédents de cette adresse.
  fails.delete(ip);
  await next();
}
