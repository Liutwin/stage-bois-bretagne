/**
 * @file routes/contact.ts
 * @description Routes Oak relatives au formulaire de contact.
 *
 * | Méthode | Chemin        | Accès  | Description                          |
 * |---------|---------------|--------|--------------------------------------|
 * | POST    | /api/contact  | Public | Envoie un email de contact           |
 */

import { Router } from "@oak/oak";
import { sendContactEmail } from "../services/email.ts";
import type { ContactFormData } from "../model/interfaces.ts";

const router = new Router({ prefix: "/api" });

/**
 * `POST /api/contact`
 *
 * Valide les données du formulaire puis envoie un email au destinataire
 * configuré via la variable d'environnement `CONTACT_EMAIL`.
 *
 * Corps attendu : {@link ContactFormData} (`fullName`, `email` et `message` sont obligatoires).
 *
 * Réponses possibles :
 * - `200` – Email envoyé avec succès.
 * - `400` – Corps JSON invalide ou champs obligatoires manquants.
 * - `500` – Échec de l'envoi SMTP (propagé depuis {@link sendContactEmail}).
 */
router.post("/contact", async (ctx) => {
  let body: Record<string, unknown>;
  try {
    body = await ctx.request.body.json();
  } catch {
    ctx.response.status = 400;
    ctx.response.body = { ok: false, error: "Corps de requête JSON invalide." };
    return;
  }

  const { fullName, email, phone, sessionId, message } = body;

  if (
    typeof fullName !== "string" || !fullName ||
    typeof email !== "string" || !email ||
    typeof message !== "string" || !message
  ) {
    ctx.response.status = 400;
    ctx.response.body = {
      ok: false,
      error: "Champs obligatoires manquants (nom, email, message).",
    };
    return;
  }

  const data: ContactFormData = {
    fullName,
    email,
    phone: typeof phone === "string" ? phone : undefined,
    sessionId: typeof sessionId === "number" ? sessionId : undefined,
    message,
  };

  await sendContactEmail(data);
  ctx.response.body = { ok: true };
});

export default router;
