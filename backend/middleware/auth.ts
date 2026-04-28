import type { Context, Next } from "@oak/oak";

export async function adminAuthMiddleware(ctx: Context, next: Next) {
  const password = Deno.env.get("ADMIN_PASSWORD");
  if (!password) {
    ctx.response.status = 500;
    ctx.response.body = { ok: false, error: "Configuration serveur invalide." };
    return;
  }
  const authHeader = ctx.request.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token || token !== password) {
    ctx.response.status = 401;
    ctx.response.body = { ok: false, error: "Non autorisé." };
    return;
  }
  await next();
}
