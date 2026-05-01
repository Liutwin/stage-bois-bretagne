/**
 * @file pages/InscriptionPage.tsx
 * @description Page "Inscription" — affiche la session active avec
 * l'accès au bulletin d'inscription PDF et le formulaire de contact.
 */

import { useState } from 'react';
import { SessionCard } from '@/components/SessionCard';
import { useSession } from '@/hooks/useSession';
import { generateRegistrationPdf, type RegistrationFormData } from '@/utils/pdf';
import styles from '../styles/InscriptionPage.module.css';
import { PageSEO } from '@/components/PageSEO';

/**
 * Page publique dédiée au prochain stage.
 *
 * Fonctionnalités :
 * - Affiche la carte de session complète
 * - Formulaire de pré-inscription (envoi par email côté backend)
 * - Téléchargement du bulletin d'inscription en PDF via jsPDF
 *
 * @returns Élément `<main>` de la page prochain stage.
 */
export function InscriptionPage() {
  const { session, loading } = useSession();

  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    profession: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    level: 'débutant',
    comment: '',
  });

  const [pdfLoading, setPdfLoading] = useState(false);

  /** Met à jour un champ du formulaire par son nom. */
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev: RegistrationFormData) => ({ ...prev, [name]: value }));
  }

  /**
   * Génère et télécharge le bulletin d'inscription au format PDF.
   * Requiert que la session soit disponible et que les champs essentiels soient remplis.
   */
  async function handleDownloadPdf() {
    if (!session) return;
    if (!formData.firstName || !formData.lastName) {
      alert('Merci de renseigner au moins votre prénom et votre nom pour générer le bulletin.');
      return;
    }
    setPdfLoading(true);
    try {
      await generateRegistrationPdf(session, formData);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <PageSEO
        title="Inscription — Stage Bois Bretagne"
        description="Dates et informations du prochain stage de chantournage à Trébrivan. Places limitées, inscription sur bulletin."
        path="/inscription"
      />
      <div className={styles.inner}>
        {/* En-tête */}
        <div className={styles.header}>
          <p className="section-label">Disponibilités</p>
          <h1 className="section-title">Inscription</h1>
          <p className={styles.intro}>
            L'atelier organise de 2 à 4 sessions par an, avec un minimum de 2 stagiaires et un maximum de 3 stagiaires.<br />
            (en deçà de 2 inscriptions, la session est annulée et l'acompte remboursé sans autre forme de dédit)<br />
            Consultez les disponibilités ci-dessous et manifestez votre intérêt
            via le formulaire — la formatrice vous recontactera rapidement.
          </p>
        </div>

        {/* Carte de session */}
        <div className={styles.cardArea}>
          {loading ? (
            <div className={styles.skeleton} aria-busy="true" />
          ) : (
            <SessionCard session={session} variant="full" />
          )}
        </div>

        {/* Prochaines dates potentielles */}
        {!loading && session?.description && (
          <div className={styles.upcomingDates}>
            <p className={styles.upcomingLabel}>Prochaines dates envisagées</p>
            <p className={styles.upcomingText}>{session.description}</p>
          </div>
        )}

        {/* Procédure d'inscription */}
        <section className={styles.procedure}>
          <h2>Modalités d'inscription</h2>
          <ol className={styles.steps}>
            <li>
              <span className={styles.stepNum}>1</span>
              <div>
                <strong>Consultez les disponibilités</strong> ci-dessus et vérifiez
                qu'il reste des places pour la prochaine session.
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <div>
                <strong>Remplissez le formulaire</strong> ci-dessous pour manifester
                votre intérêt. La formatrice vous recontactera sous 48 h.
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>3</span>
              <div>
                <strong>Téléchargez le bulletin d'inscription</strong> en PDF,
                imprimez-le, complétez-le et renvoyez-le accompagné d'un chèque
                d'acompte (70 €) par courrier postal.
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>4</span>
              <div>
                <strong>Votre inscription est validée</strong> à réception du
                courrier par Annick. Elle vous confirmera votre place par email.
              </div>
            </li>
          </ol>
        </section>

        {/* Formulaire pré-inscription */}
        {session && session.isVisible && session.spotsAvailable > 0 && (
          <section className={styles.formSection}>
            <h2>Préparer mon bulletin d'inscription</h2>
            <p className={styles.formIntro}>
              Renseignez vos coordonnées pour générer votre bulletin pré-rempli en PDF.
            </p>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="firstName">Prénom *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName">Nom *</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="dateOfBirth">Date de naissance</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  autoComplete="bday"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="profession">Profession</label>
                <input
                  id="profession"
                  name="profession"
                  type="text"
                  value={formData.profession}
                  onChange={handleChange}
                  autoComplete="organization-title"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="phone">Téléphone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="address">Adresse</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="postalCode">Code postal</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleChange}
                  autoComplete="postal-code"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="city">Ville</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="comment">Commentaire / demande particulière</label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  value={formData.comment}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.pdfAction}>
              <button
                className="btn btn-primary"
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
              >
                {pdfLoading ? 'Génération…' : '⬇ Télécharger le bulletin PDF'}
              </button>
              <p className={styles.pdfNote}>
                Imprimez ce bulletin, complétez-le et envoyez-le avec votre
                chèque d'acompte à : <br /> <strong>Annick Le Goasteller, 3 Kermoal,
                22340 Trébrivan</strong>.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
