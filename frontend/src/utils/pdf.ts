/**
 * @file utils/pdf.ts
 * @description Génération côté client du bulletin d'inscription au format PDF via jsPDF.
 * Aucune dépendance serveur — le PDF est produit directement dans le navigateur.
 */

import { jsPDF } from 'jspdf';
import type { Session } from '@/types/session';

/**
 * Données saisies par le stagiaire pour remplir le bulletin d'inscription.
 */
export interface RegistrationFormData {
  /** Prénom du stagiaire. */
  firstName: string;
  /** Nom de famille du stagiaire. */
  lastName: string;
  /** Adresse email. */
  email: string;
  /** Numéro de téléphone. */
  phone: string;
  /** Adresse postale complète. */
  address: string;
  /** Code postal. */
  postalCode: string;
  /** Ville. */
  city: string;
  /** Niveau du stagiaire : débutant, intermédiaire ou confirmé. */
  level: 'débutant' | 'intermédiaire' | 'confirmé';
  /** Date de naissance (facultatif). */
  dateOfBirth?: string;
  /** Profession (facultatif). */
  profession?: string;
  /** Commentaire ou demande particulière (facultatif). */
  comment?: string;
}

/**
 * Génère et télécharge le bulletin d'inscription pré-rempli en PDF.
 *
 * Le bulletin rappelle :
 * - les informations de la session choisie,
 * - les coordonnées du stagiaire,
 * - les conditions d'inscription (acompte par chèque, envoi postal),
 * - l'adresse d'envoi.
 *
 * @param session - Données de la session concernée.
 * @param registrant - Informations saisies par le stagiaire.
 *
 * @example
 * ```ts
 * await generateRegistrationPdf(session, {
 *   firstName: 'Marie',
 *   lastName: 'Dupont',
 *   email: 'marie@example.com',
 *   phone: '06 12 34 56 78',
 *   address: '12 rue des Lilas',
 *   postalCode: '35000',
 *   city: 'Rennes',
 *   level: 'débutant',
 * });
 * ```
 */
export function generateRegistrationPdf(
  session: Session,
  registrant: RegistrationFormData,
): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  // ── Palette cohérente avec le site ──────────────────────────────────────
  const colorWood = [122, 100, 80] as const;    // --tm : brun moyen
  const colorDark = [61, 34, 16] as const;      // --wd : brun foncé
  const colorAccent = [184, 118, 10] as const;  // --wa : ocre/ambre
  const colorLight = [246, 241, 232] as const;  // --cr : crème

  const pageW = 210;
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── En-tête ──────────────────────────────────────────────────────────────
  doc.setFillColor(...colorDark);
  doc.rect(0, 0, pageW, 38, 'F');

  doc.setTextColor(245, 217, 160); // --wl
  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.text('Stage Bois Bretagne', margin, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 175, 130);
  doc.text('Chantournage · Centre Bretagne', margin, 23);
  doc.text('3 Kermoal · 22340 Trébrivan', margin, 29);
  doc.text('Tél. : 02 96 29 71 97', margin, 35);

  doc.setFontSize(13);
  doc.setFont('times', 'bolditalic');
  doc.setTextColor(245, 217, 160);
  doc.text("Bulletin d'inscription", pageW - margin, 22, { align: 'right' });

  y = 48;

  // ── Bandeau session ──────────────────────────────────────────────────────
  doc.setFillColor(...colorLight);
  doc.roundedRect(margin, y, contentW, 24, 2, 2, 'F');
  doc.setDrawColor(...colorAccent);
  doc.setLineWidth(0.6);
  doc.line(margin, y + 24, margin + contentW, y + 24);

  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  doc.setTextColor(...colorDark);
  doc.text(`Stage : ${session.theme}`, margin + 5, y + 9);

  const startFormatted = formatDate(session.startDate);
  const endFormatted = formatDate(session.endDate);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colorWood);
  doc.text(`Du ${startFormatted} au ${endFormatted}`, margin + 5, y + 16);
  doc.text(`Places disponibles : ${session.spotsAvailable} / ${session.totalSpots}`, margin + 5, y + 21);

  y += 34;

  // ── Section coordonnées ──────────────────────────────────────────────────
  y = renderSection(doc, 'Coordonnées du stagiaire', y, margin, contentW, colorAccent, colorDark);

  const fields: [string, string][] = [
    ['Prénom', registrant.firstName],
    ['Nom', registrant.lastName],
    ['Date de naissance', registrant.dateOfBirth ?? ''],
    ['Profession', registrant.profession ?? ''],
    ['Email', registrant.email],
    ['Téléphone', registrant.phone],
    ['Adresse', registrant.address],
    ['Code postal', registrant.postalCode],
    ['Ville', registrant.city],
    ['Niveau', registrant.level],
  ];

  y = renderFieldGrid(doc, fields, y, margin, contentW, colorWood, colorDark);

  if (registrant.comment) {
    y += 4;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colorWood);
    doc.text('Commentaire / demande particulière :', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colorDark);
    const lines = doc.splitTextToSize(registrant.comment, contentW);
    doc.text(lines as string[], margin, y);
    y += (lines as string[]).length * 5 + 4;
  }

  y += 6;

  // ── Conditions d'inscription ─────────────────────────────────────────────
  y = renderSection(doc, "Conditions d'inscription", y, margin, contentW, colorAccent, colorDark);

  const conditions = [
    "1. Retournez ce bulletin complété et signé accompagné d'un chèque d'acompte (30 %) à l'adresse ci-dessous.",
    "2. L'inscription n'est définitivement validée qu'à réception du courrier.",
    '3. Aucun paiement en ligne. Le solde est réglé à votre arrivée.',
    "4. En cas d'annulation moins de 15 jours avant le stage, l'acompte reste acquis.",
  ];

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colorWood);
  for (const cond of conditions) {
    const lines = doc.splitTextToSize(cond, contentW);
    doc.text(lines as string[], margin, y);
    y += (lines as string[]).length * 5 + 2;
  }

  y += 6;

  // ── Adresse d'envoi ──────────────────────────────────────────────────────
  doc.setFillColor(...colorDark);
  doc.roundedRect(margin, y, contentW, 26, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 175, 130);
  doc.text('Adresse de retour :', margin + 5, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(245, 217, 160);
  doc.text('Annick Le Goasteller', margin + 5, y + 14);
  doc.text('3 Kermoal · 22340 Trébrivan', margin + 5, y + 19);
  doc.text("Chèque à l'ordre de : Annick Le Goasteller", margin + 5, y + 24);

  y += 36;

  // ── Signature ────────────────────────────────────────────────────────────
  doc.setDrawColor(...colorWood);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 70, y);
  doc.line(pageW - margin - 60, y, pageW - margin, y);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colorWood);
  doc.text('Date et lieu', margin, y + 4);
  doc.text('Signature du stagiaire', pageW - margin - 60, y + 4);

  // ── Pied de page ─────────────────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setTextColor(160, 140, 120);
  doc.text(
    `Document généré le ${new Date().toLocaleDateString('fr-FR')} · stageboisbretagne.com`,
    pageW / 2,
    295,
    { align: 'center' },
  );

  // ── Téléchargement ───────────────────────────────────────────────────────
  const filename = `inscription_${registrant.lastName.toLowerCase()}_${session.startDate}.pdf`;
  doc.save(filename);
}

// ── Helpers privés ──────────────────────────────────────────────────────────

/**
 * Affiche un titre de section avec une ligne décorative ambrée.
 *
 * @param doc - Instance jsPDF en cours.
 * @param title - Libellé de la section.
 * @param y - Position verticale de départ en mm.
 * @param margin - Marge horizontale en mm.
 * @param contentW - Largeur utile en mm.
 * @param colorAccent - Couleur RGB de l'accent.
 * @param colorDark - Couleur RGB du texte foncé.
 * @returns Nouvelle position verticale après la section.
 */
function renderSection(
  doc: jsPDF,
  title: string,
  y: number,
  margin: number,
  contentW: number,
  colorAccent: readonly [number, number, number],
  colorDark: readonly [number, number, number],
): number {
  doc.setDrawColor(...colorAccent);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + contentW, y);

  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  doc.setTextColor(...colorDark);
  doc.text(title, margin, y + 7);

  return y + 13;
}

/**
 * Affiche une grille de champs étiquette/valeur sur deux colonnes.
 *
 * @param doc - Instance jsPDF en cours.
 * @param fields - Tableau de tuples `[étiquette, valeur]`.
 * @param y - Position verticale de départ en mm.
 * @param margin - Marge horizontale en mm.
 * @param contentW - Largeur utile en mm.
 * @param colorLabel - Couleur RGB des étiquettes.
 * @param colorValue - Couleur RGB des valeurs.
 * @returns Nouvelle position verticale après la grille.
 */
function renderFieldGrid(
  doc: jsPDF,
  fields: [string, string][],
  y: number,
  margin: number,
  contentW: number,
  colorLabel: readonly [number, number, number],
  colorValue: readonly [number, number, number],
): number {
  const colW = contentW / 2;
  let row = 0;

  for (let i = 0; i < fields.length; i += 2) {
    const rowY = y + row * 9;
    const pairs = [fields[i], fields[i + 1]].filter(Boolean);

    pairs.forEach(([label, value], col) => {
      const x = margin + col * colW;
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colorLabel);
      doc.text(`${label} :`, x, rowY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colorValue);
      doc.text(value || '—', x, rowY + 5);
    });

    row++;
  }

  return y + row * 9 + 4;
}

/**
 * Formate une date ISO 8601 (YYYY-MM-DD) en chaîne lisible en français.
 *
 * @param isoDate - Date au format `YYYY-MM-DD`.
 * @returns Date formatée, ex : `"15 septembre 2025"`.
 */
function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
