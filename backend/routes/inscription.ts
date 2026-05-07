/**
 * @file routes/inscription.ts
 * @description Route Oak pour la réception des bulletins d'inscription.
 *
 * | Méthode | Chemin            | Accès  | Description                                      |
 * |---------|-------------------|--------|--------------------------------------------------|
 * | POST    | /api/inscription  | Public | Envoie le bulletin PDF par email à la formatrice |
 */

import { Router } from "@oak/oak";
import { sendInscriptionEmail } from "../services/email.ts";
import { rateLimiter } from "../middleware/rateLimiter.ts";

const router = new Router({ prefix: "/api" });
const limit = rateLimiter(3, 10 * 60 * 1000);

router.post("/inscription", limit, async (ctx) => {
  let parsed: Record<string, unknown>;
  try {
    parsed = await ctx.request.body.json();
  } catch {
    ctx.response.status = 400;
    ctx.response.body = { ok: false, error: "Corps JSON invalide." };
    return;
  }

  const { firstName, lastName, email, filename } = parsed;
  if (
    typeof firstName !== "string" || !firstName ||
    typeof lastName  !== "string" || !lastName  ||
    typeof email     !== "string" || !email     ||
    typeof filename  !== "string" || !filename
  ) {
    ctx.response.status = 400;
    ctx.response.body = { ok: false, error: "Champs obligatoires manquants." };
    return;
  }

  try {
    await sendInscriptionEmail({
      firstName,
      lastName,
      email,
      filename,
      phone:        typeof parsed.phone        === "string" ? parsed.phone        : undefined,
      address:      typeof parsed.address      === "string" ? parsed.address      : undefined,
      postalCode:   typeof parsed.postalCode   === "string" ? parsed.postalCode   : undefined,
      city:         typeof parsed.city         === "string" ? parsed.city         : undefined,
      dateOfBirth:  typeof parsed.dateOfBirth  === "string" ? parsed.dateOfBirth  : undefined,
      profession:   typeof parsed.profession   === "string" ? parsed.profession   : undefined,
      niveau:       typeof parsed.niveau       === "string" ? parsed.niveau       : undefined,
      comment:      typeof parsed.comment      === "string" ? parsed.comment      : undefined,
      sessionId:    typeof parsed.sessionId    === "number" ? parsed.sessionId    : undefined,
      stageLabel:   typeof parsed.stageLabel   === "string" ? parsed.stageLabel   : undefined,
      sessionDate:  typeof parsed.sessionDate  === "string" ? parsed.sessionDate  : undefined,
    });
    ctx.response.body = { ok: true };
  } catch (err) {
    console.error("[inscription] Échec envoi email :", err);
    ctx.response.status = 500;
    ctx.response.body = { ok: false, error: "Échec de l'envoi de l'email." };
  }
});

export default router;
