/**
 * @file services/email.ts
 * @description Envoi d'emails transactionnels via Nodemailer (SMTP).
 * La configuration du transporteur est lue depuis les variables d'environnement au démarrage.
 */

import { load } from "jsr:@std/dotenv";
import nodemailer from "npm:nodemailer";
import type { ContactFormData } from "../model/interfaces.ts";

await load({ export: true });

interface InscriptionEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  profession?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  comment?: string;
  sessionId?: number;
  filename: string;
}

/**
 * Crée un transporteur Nodemailer en lisant les variables d'environnement
 * au moment de l'appel (et non au chargement du module).
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: Deno.env.get("SMTP_HOST"),
    port: parseInt(Deno.env.get("SMTP_PORT") ?? "587"),
    secure: Deno.env.get("SMTP_SECURE") === "true",
    auth: {
      user: Deno.env.get("NOREPLY_MAIL_USER"),
      pass: Deno.env.get("NOREPLY_MAIL_PASSWORD"),
    },
  });
}

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

  await createTransporter().sendMail({
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

/**
 * Envoie un email de notification à la formatrice (`CLIENT_EMAIL`) lors de la
 * génération d'un bulletin d'inscription, avec le PDF en pièce jointe.
 *
 * @param data - Données du formulaire et PDF encodé en base64.
 */
export async function sendInscriptionEmail(data: InscriptionEmailData): Promise<void> {
  const from = `Stage Bois Bretagne <${Deno.env.get("NOREPLY_MAIL_USER")}>`;
  const to = Deno.env.get("CLIENT_EMAIL");

  const rows = [
    ["Prénom",            data.firstName],
    ["Nom",               data.lastName],
    ["Email",             data.email],
    ["Téléphone",         data.phone],
    ["Date de naissance", data.dateOfBirth],
    ["Profession",        data.profession],
    ["Adresse",           data.address],
    ["Code postal",       data.postalCode],
    ["Ville",             data.city],
  ].filter((r): r is [string, string] => !!r[1]);

  const textLines = rows.map(([k, v]) => `${k} : ${v}`);
  if (data.comment) textLines.push("", `Commentaire : ${data.comment}`);

  const htmlRows = rows
    .map(([k, v]) => `<p><strong>${k} :</strong> ${v}</p>`)
    .join("\n");
  const htmlComment = data.comment
    ? `<hr><p><strong>Commentaire :</strong></p><p>${data.comment.replace(/\n/g, "<br>")}</p>`
    : "";

  await createTransporter().sendMail({
    from,
    to,
    replyTo: data.email,
    subject: `Nouvelle inscription — ${data.firstName} ${data.lastName}`,
    text: textLines.join("\n"),
    html: `${htmlRows}${htmlComment}`,
  });
}
