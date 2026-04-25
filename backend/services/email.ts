/**
 * @file services/email.ts
 * @description Envoi d'emails transactionnels via Nodemailer (SMTP).
 * La configuration du transporteur est lue depuis les variables d'environnement au démarrage.
 */

import { load } from "jsr:@std/dotenv";
import nodemailer from "npm:nodemailer";
import type { ContactFormData } from "../model/interfaces.ts";

await load({ export: true });

const HOSTNAME = Deno.env.get("HOST") ?? "0.0.0.0";

/**
 * Transporteur Nodemailer configuré via les variables d'environnement :
 * `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`.
 */
const transporter = nodemailer.createTransport({
  host: Deno.env.get("SMTP_HOST"),
  port: parseInt(Deno.env.get("SMTP_PORT") ?? "587"),
  secure: Deno.env.get("SMTP_SECURE") === "true",
  auth: {
    user: Deno.env.get("NOREPLY_MAIL_USER"),
    pass: Deno.env.get("NOREPLY_MAIL_PASSWORD"),
  },
});

/**
 * Envoie un email de notification au destinataire configuré (`CONTACT_EMAIL`)
 * à partir des données soumises par le formulaire de contact du site.
 *
 * L'email est envoyé en double format : texte brut et HTML.
 * Les champs facultatifs (`phone`, `sessionId`) sont inclus uniquement s'ils sont renseignés.
 *
 * @param data - Données validées du formulaire de contact.
 * @returns Promesse résolue une fois l'email envoyé avec succès.
 * @throws {Error} Si le transporteur SMTP échoue (credentials invalides, serveur injoignable…).
 */
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const from = `Stage Bois Bretagne <${Deno.env.get("NOREPLY_MAIL_USER")}>`;
  const to = Deno.env.get("CLIENT_EMAIL");

  const textLines = [
    `Nom : ${data.fullName}`,
    `Email : ${data.email}`,
    data.phone ? `Téléphone : ${data.phone}` : null,
    data.sessionId != null ? `Session souhaitée : #${data.sessionId}` : null,
    "",
    "Message :",
    data.message,
  ].filter((l): l is string => l !== null);

  const htmlExtra = [
    data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : "",
    data.sessionId != null
      ? `<p><strong>Session souhaitée :</strong> #${data.sessionId}</p>`
      : "",
  ].join("");

  await transporter.sendMail({
    from,
    to,
    replyTo: data.email,  // ← Les réponses vont ici
    subject: `Nouveau message de ${data.fullName} — Stage Bois Bretagne`,
    text: textLines.join("\n"),
    html: `
      <p><strong>Nom :</strong> ${data.fullName}</p>
      <p><strong>Email :</strong> ${data.email}</p>
      ${htmlExtra}
      <hr>
      <p><strong>Message :</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `.trim(),
  });
}
