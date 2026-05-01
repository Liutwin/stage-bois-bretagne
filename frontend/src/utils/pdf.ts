/**
 * @file utils/pdf.ts
 * @description Génération du bulletin d'inscription au format PDF via jsPDF.
 * Produit un document A4 portrait avec logos, coordonnées du stagiaire,
 * conditions d'inscription, adresse de retour et zones de signature.
 */

import { jsPDF } from 'jspdf';
import type { Session } from '@/types/session';

import datadockeUrl from '@/images/datadocke.jpg';
import logoChantournageUrl from '@/images/logo-chantournage.jpg';
import creationsPanelUrl from '@/assets/creations-panel.jpg';

/**
 * Données saisies par le participant dans le formulaire de pré-inscription.
 * Utilisées pour pré-remplir le bulletin PDF.
 */
export interface RegistrationFormData {
  /** Prénom du stagiaire. */
  firstName: string;
  /** Nom de famille du stagiaire. */
  lastName: string;
  /** Adresse e-mail de contact. */
  email: string;
  /** Numéro de téléphone. */
  phone: string;
  /** Rue et numéro. */
  address: string;
  /** Code postal. */
  postalCode: string;
  /** Ville. */
  city: string;
  /** Niveau de pratique déclaré. */
  level: 'débutant' | 'intermédiaire' | 'confirmé';
  /** Date de naissance au format `YYYY-MM-DD` (optionnel). */
  dateOfBirth?: string;
  /** Profession (optionnel). */
  profession?: string;
  /** Commentaire libre ou demande particulière (optionnel). */
  comment?: string;
}

/**
 * Génère et télécharge le bulletin d'inscription pré-rempli au format PDF.
 *
 * Charge les logos en parallèle, compose le document A4 (en-tête, coordonnées,
 * conditions, adresse de retour, zones de signature) puis déclenche le
 * téléchargement via `jsPDF.save()`.
 *
 * @param session - Session de stage à afficher dans l'en-tête du bulletin.
 * @param registrant - Données du formulaire à pré-remplir.
 * @returns Promesse résolue une fois le fichier téléchargé.
 */
export async function generateRegistrationPdf(
  session: Session,
  registrant: RegistrationFormData,
): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const colorWood   = [122, 100, 80]  as const;
  const colorDark   = [61,  34,  16]  as const;
  const colorAccent = [184, 118, 10]  as const;
  const colorLight  = [246, 241, 232] as const;

  const pageW    = 210;
  const margin   = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── Logos ─────────────────────────────────────────────────────────────────
  const [imgDatadocke, imgChantournage, imgCreations] = await Promise.all([
    loadImage(datadockeUrl),
    loadImage(logoChantournageUrl),
    loadImage(creationsPanelUrl),
  ]);

  const logoH = 20;
  const logoData = [imgDatadocke, imgChantournage, imgCreations].map(img => ({
    img,
    w: Math.min((img.naturalWidth / img.naturalHeight) * logoH, 60),
  }));
  const logoY = 6;

  // Premier aligné à gauche, dernier à droite, milieu centré entre les deux
  const xLeft  = margin;
  const xRight = margin + contentW - logoData[2].w;
  const xMid   = (xLeft + logoData[0].w + xRight) / 2 - logoData[1].w / 2;
  const xPositions = [xLeft, xMid, xRight];
  logoData.forEach(({ img, w }, i) => {
    doc.addImage(img, 'JPEG', xPositions[i], logoY, w, logoH);
  });

  y = logoY + logoH + 14;

  // ── En-tête ───────────────────────────────────────────────────────────────
  doc.setFontSize(22);
  doc.setFont('times', 'bold');
  doc.setTextColor(...colorDark);
  doc.text('Stage « jouets et découpes »', margin, y);

  doc.setFontSize(17);
  doc.setFont('times', 'bolditalic');
  doc.setTextColor(...colorAccent);
  doc.text("Bulletin d'inscription", pageW - margin, y, { align: 'right' });

  y += 6;

  // ── Bandeau session (dates uniquement) ────────────────────────────────────
  doc.setFillColor(...colorLight);
  doc.roundedRect(margin, y, contentW, 14, 2, 2, 'F');

  const startFormatted = formatDate(session.startDate);
  const endFormatted   = formatDate(session.endDate);
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(...colorDark);
  doc.text(`Du ${startFormatted} au ${endFormatted}`, margin + 5, y + 9);

  y += 17;

  // ── Section coordonnées ──────────────────────────────────────────────────
  y = renderSection(doc, 'Coordonnées du stagiaire', y, margin, contentW, colorAccent, colorDark);

  const fields: [string, string][] = [
    ['Prénom',            registrant.firstName],
    ['Nom',               registrant.lastName],
    ['Date de naissance', formatDateShort(registrant.dateOfBirth)],
    ['Profession',        registrant.profession ?? ''],
    ['Email',             registrant.email],
    ['Téléphone',         registrant.phone],
    ['Adresse',           registrant.address],
    ['Code postal',       registrant.postalCode],
    ['Ville',             registrant.city],
  ];

  y = renderFieldGrid(doc, fields, y, margin, contentW, colorWood, colorDark);

  if (registrant.comment) {
    y += 4;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colorWood);
    doc.text('Commentaire / demande particulière :', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colorDark);
    const lines = doc.splitTextToSize(registrant.comment, contentW);
    doc.text(lines as string[], margin, y);
    y += (lines as string[]).length * 5.5 + 4;
  }

  // ── Conditions d'inscription ─────────────────────────────────────────────
  y = renderSection(doc, "Conditions d'inscription", y, margin, contentW, colorAccent, colorDark);

  const conditionParagraphs = [
    "Je vous adresse ci-joint mon acompte de 70 € par chèque à votre ordre, et une enveloppe affranchie à mon adresse (si je n'ai pas d'adresse mail). Je vous règlerai le solde en cours de stage.",
    "J'ai bien noté que cet acompte restera valable un an à dater de sa réception, en cas d'annulation de ma part pour raison de force majeure, et qu'il me sera restitué intégralement sans autre forme de dédit en cas d'annulation de votre part.",
  ];

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colorWood);
  for (const para of conditionParagraphs) {
    const lines = doc.splitTextToSize(para, contentW);
    doc.text(lines as string[], margin, y);
    y += (lines as string[]).length * 5.5 + 3;
  }

  y += 1;

  // ── Adresse d'envoi ───────────────────────────────────────────────────────
  doc.setDrawColor(...colorWood);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, 34, 2, 2, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colorWood);
  doc.text('Adresse de retour :', margin + 5, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colorDark);
  doc.text('Annick Le Goasteller', margin + 5, y + 16);
  doc.text('3 Kermoal · 22340 Trébrivan', margin + 5, y + 23);
  doc.text("Chèque à l'ordre de : Annick Le Goasteller", margin + 5, y + 30);

  y += 44;

  // ── Signature ────────────────────────────────────────────────────────────
  doc.setDrawColor(...colorWood);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 70, y);
  doc.line(pageW - margin - 65, y, pageW - margin, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colorWood);
  doc.text('Date et lieu', margin, y + 5);
  doc.text('Signature du stagiaire', pageW - margin - 65, y + 5);

  // ── Pied de page ─────────────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colorDark);
  doc.text('TRAVAIL A LA SCIE A CHANTOURNER', pageW / 2, 282, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colorWood);
  doc.text(
    'Annick Le Goasteller, formatrice professionnelle N° 53 22 08 348 22',
    pageW / 2, 287, { align: 'center' },
  );
  doc.text(
    'Siret 42935239600023 – Organisme « datadocké »',
    pageW / 2, 292, { align: 'center' },
  );

  const filename = `inscription_${registrant.lastName.toLowerCase()}_${session.startDate}.pdf`;
  doc.save(filename);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Charge une image depuis une URL et retourne l'élément `HTMLImageElement` une fois prêt.
 *
 * @param url - URL ou data-URL de l'image.
 * @returns Promesse résolue avec l'image chargée.
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Dessine un séparateur horizontal coloré et un titre de section dans le PDF.
 *
 * @param doc - Instance jsPDF courante.
 * @param title - Libellé de la section.
 * @param y - Position verticale de départ (mm).
 * @param margin - Marge horizontale (mm).
 * @param contentW - Largeur utile du contenu (mm).
 * @param colorAccent - Couleur du trait séparateur `[R, G, B]`.
 * @param colorDark - Couleur du texte `[R, G, B]`.
 * @returns Nouvelle position `y` après la section (mm).
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

  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(...colorDark);
  doc.text(title, margin, y + 8);

  return y + 18;
}

/**
 * Dessine une grille de champs label/valeur sur deux colonnes dans le PDF.
 *
 * @param doc - Instance jsPDF courante.
 * @param fields - Tableau de paires `[label, valeur]` à afficher.
 * @param y - Position verticale de départ (mm).
 * @param margin - Marge horizontale (mm).
 * @param contentW - Largeur utile du contenu (mm).
 * @param colorLabel - Couleur des libellés `[R, G, B]`.
 * @param colorValue - Couleur des valeurs `[R, G, B]`.
 * @returns Nouvelle position `y` après la grille (mm).
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
  const colW   = contentW / 2;
  const rowH   = 14;
  let row = 0;

  for (let i = 0; i < fields.length; i += 2) {
    const rowY = y + row * rowH;
    const pairs = [fields[i], fields[i + 1]].filter(Boolean);

    pairs.forEach(([label, value], col) => {
      const x = margin + col * colW;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colorLabel);
      doc.text(`${label} :`, x, rowY);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colorValue);
      doc.text(value || '—', x, rowY + 6);
    });

    row++;
  }

  return y + row * rowH + 2;
}

/**
 * Formate une date ISO en `JJ/MM/AAAA`. Retourne une chaîne vide si la date est absente.
 *
 * @param isoDate - Date au format `YYYY-MM-DD` (optionnel).
 */
function formatDateShort(isoDate?: string): string {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Formate une date ISO en chaîne longue française. Ex : `"15 septembre 2025"`.
 *
 * @param isoDate - Date au format `YYYY-MM-DD`.
 */
function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
