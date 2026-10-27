import type { Context, Next } from "@oak/oak";

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Crée un middleware Oak de rate limiting en mémoire par IP.
 *
 * @param max - Nombre maximum de requêtes autorisées par fenêtre.
 * @param windowMs - Durée de la fenêtre en millisecondes.
 */
export function rateLimiter(max: number, windowMs: number) {
  const store = new Map<string, Bucket>();

  // Nettoyage périodique des entrées expirées pour éviter les fuites mémoire
  setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of store) {
      if (now >= bucket.resetAt) store.delete(ip);
    }
  }, windowMs);

  return async (ctx: Context, next: Next) => {
    const ip = ctx.request.headers.get("x-real-ip") ?? ctx.request.ip ?? "unknown";

    const now = Date.now();
    let bucket = store.get(ip);

    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      store.set(ip, bucket);
    }

    bucket.count++;

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      ctx.response.status = 429;
      ctx.response.headers.set("Retry-After", String(retryAfter));
      ctx.response.body = {
        ok: false,
        error: "Trop de requêtes. Veuillez réessayer dans quelques minutes.",
      };
      return;
    }

    await next();
  };
}
