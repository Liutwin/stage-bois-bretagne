import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicSessions } from '@/utils/api';
import { generateRegistrationPdf, type RegistrationFormData } from '@/utils/pdf';
import type { Session, StageType } from '@/types/session';
import { STAGE_LABELS } from '@/types/session';
import styles from '../styles/InscriptionPage.module.css';
import { PageSEO } from '@/components/PageSEO';

const STAGE_TYPES: StageType[] = ['initiation', 'jouets', 'perfectionnement'];

const TYPE_META: Record<StageType, {
  label: string;
  sub: string;
  programmeLabel: string;
  waitingTitle: string;
}> = {
  initiation: {
    label: "Stage d'initiation",
    sub: "Week-end · 12 heures · 230 €",
    programmeLabel: "Voir le programme",
    waitingTitle: "Aucune date programmée pour le moment",
  },
  jouets: {
    label: "Journée de fabrication d'un jouet",
    sub: "Journée · 12 heures · 230 €",
    programmeLabel: "Voir le programme",
    waitingTitle: "Aucune date programmée pour le moment",
  },
  perfectionnement: {
    label: "Journée de perfectionnement",
    sub: "Journée · 7 heures · 140 €",
    programmeLabel: "Voir le programme",
    waitingTitle: "Aucune date programmée pour le moment",
  },
};

function formatSessionDates(startIso: string, endIso: string): string {
  const start = new Date(`${startIso}T00:00:00`);
  const end   = new Date(`${endIso}T00:00:00`);
  const sameDay = startIso === endIso;
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameDay) {
    return start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  if (sameYear) {
    return `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} – ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
  return `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} – ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

function InlineSessionCard({ session, onFormClick }: { session: Session; onFormClick: () => void }) {
  const isFull = session.spotsAvailable === 0;
  return (
    <div>
      <div className={styles.inlineCardBar}>
        <span className={styles.inlineCardDates}>
          {formatSessionDates(session.startDate, session.endDate)}
        </span>
        <span className={`${styles.badge} ${isFull ? styles.badgeFull : styles.badgeOk}`}>
          {isFull
            ? 'Complet'
            : `${session.spotsAvailable} place${session.spotsAvailable > 1 ? 's' : ''} disponible${session.spotsAvailable > 1 ? 's' : ''}`
          }
        </span>
      </div>
      <div className={styles.inlineCardBody}>
        {session.description && (
          <p className={styles.inlineCardSpots}>{session.description}</p>
        )}
        <div className={styles.inlineCardCta}>
          {!isFull && (
            <button onClick={onFormClick} className="btn btn-primary">
              Remplir le formulaire ↓
            </button>
          )}
          <a href="/contact" className="btn btn-outline">Poser une question</a>
        </div>
      </div>
    </div>
  );
}

export function InscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [sessionMap, setSessionMap] = useState<Record<StageType, Session | null>>({
    initiation: null, jouets: null, perfectionnement: null,
  });
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfSent, setPdfSent] = useState(false);

  const [selectedType, setSelectedType] = useState<StageType>(() => {
    const t = new URLSearchParams(window.location.search).get('type') as StageType;
    return STAGE_TYPES.includes(t) ? t : 'initiation';
  });

  function scrollToForm(type: StageType) {
    setSelectedType(type);
    requestAnimationFrame(() => {
      document.getElementById('formulaire')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

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
    niveau: 'débutant',
    comment: '',
  });

  useEffect(() => {
    fetchPublicSessions()
      .then(sessions => {
        const map: Record<StageType, Session | null> = {
          initiation: null, jouets: null, perfectionnement: null,
        };
        for (const s of sessions) { map[s.type] = s; }
        setSessionMap(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visibleTypes = STAGE_TYPES.filter(t => sessionMap[t]?.isVisible);

  useEffect(() => {
    if (!loading && visibleTypes.length > 0 && !visibleTypes.includes(selectedType)) {
      setSelectedType(visibleTypes[0]);
    }
  }, [loading]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      niveau: selectedType === 'initiation' ? 'débutant' : 'intermédiaire',
    }));
  }, [selectedType]);

  const sessionForPdf = sessionMap[selectedType];

  useEffect(() => {
    if (!sessionForPdf) { setPdfSent(false); return; }
    setPdfSent(localStorage.getItem(`pdf_sent_${sessionForPdf.id}`) === '1');
  }, [sessionForPdf?.id]);

  async function handleDownloadPdf() {
    if (!sessionForPdf) return;
    const required: [keyof RegistrationFormData, string][] = [
      ['firstName',   'Prénom'],
      ['lastName',    'Nom'],
      ['dateOfBirth', 'Date de naissance'],
      ['profession',  'Profession'],
      ['email',       'Email'],
      ['phone',       'Téléphone'],
      ['address',     'Adresse'],
      ['postalCode',  'Code postal'],
      ['city',        'Ville'],
    ];
    const missing = required.filter(([k]) => !formData[k]).map(([, label]) => label);
    if (missing.length > 0) {
      alert(`Merci de renseigner les champs obligatoires : ${missing.join(', ')}.`);
      return;
    }
    setPdfLoading(true);
    try {
      const { filename } = await generateRegistrationPdf(sessionForPdf, formData);
      localStorage.setItem(`pdf_sent_${sessionForPdf.id}`, '1');
      setPdfSent(true);
      const sessionDate = formatSessionDates(sessionForPdf.startDate, sessionForPdf.endDate);
      fetch('/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sessionId: sessionForPdf.id,
          filename,
          stageLabel: STAGE_LABELS[selectedType],
          sessionDate,
        }),
      }).catch(() => {});
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
          <p className="section-label">S'inscrire</p>
          <h1 className="section-title">Calendrier et inscription</h1>
          <p className={styles.intro}>
            Consultez les disponibilités ci-dessous et manifestez votre intérêt via le formulaire.<br />
            Annick vous recontactera rapidement pour confirmer votre place.
          </p>
        </div>

        {/* Sections par type de stage */}
        {loading ? (
          <>
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
          </>
        ) : (
          STAGE_TYPES.map(type => {
            const meta    = TYPE_META[type];
            const session = sessionMap[type];
            return (
              <div key={type} id={type} className={styles.typeSection}>
                <div className={styles.typeSectionHeader}>
                  <div>
                    <h2 className={styles.typeSectionTitle}>{meta.label}</h2>
                    <p className={styles.typeSectionSub}>{meta.sub}</p>
                  </div>
                  <Link to={`/formules#${type}`} className="btn btn-outline">{meta.programmeLabel}</Link>
                </div>

                {session?.isVisible ? (
                  <InlineSessionCard session={session} onFormClick={() => scrollToForm(type)} />
                ) : (
                  <div className={styles.waiting}>
                    <div className={styles.waitingIcon}>◷</div>
                    <div>
                      <p className={styles.waitingTitle}>{meta.waitingTitle}</p>
                      {session?.description && (
                        <p className={styles.waitingText}>{session.description}</p>
                      )}
                      <Link
                        to="/contact"
                        className={`btn btn-primary ${styles.waitingCta}`}
                      >
                        Manifester mon intérêt →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Procédure + formulaire : masqués si aucune session programmée */}
        {!loading && visibleTypes.length === 0 ? null : (<>

        {/* Procédure */}
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
        <section id="formulaire" className={styles.formSection}>
          <h2>Préparer mon bulletin d'inscription</h2>
          <p className={styles.formIntro}>
            Renseignez vos coordonnées pour générer votre bulletin pré-rempli en PDF.
          </p>

          <div className={styles.formGrid}>
            {visibleTypes.length > 0 && (
              <div className={styles.field}>
                <label htmlFor="stageType">Type de stage *</label>
                <select
                  id="stageType"
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value as StageType)}
                >
                  {visibleTypes.map(t => (
                    <option key={t} value={t}>{STAGE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
            )}
            <div className={styles.field}>
              <label htmlFor="niveau">Niveau *</label>
              <select id="niveau" name="niveau" value={formData.niveau} onChange={handleChange}>
                <option value="débutant">Débutant</option>
                <option value="intermédiaire">Intermédiaire</option>
                <option value="confirmé">Confirmé</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="firstName">Prénom *</label>
              <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} autoComplete="given-name" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="lastName">Nom *</label>
              <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} autoComplete="family-name" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="dateOfBirth">Date de naissance *</label>
              <input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} autoComplete="bday" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="profession">Profession *</label>
              <input id="profession" name="profession" type="text" value={formData.profession} onChange={handleChange} autoComplete="organization-title" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone">Téléphone *</label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} autoComplete="tel" required />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label htmlFor="address">Adresse *</label>
              <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} autoComplete="street-address" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="postalCode">Code postal *</label>
              <input id="postalCode" name="postalCode" type="text" value={formData.postalCode} onChange={handleChange} autoComplete="postal-code" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="city">Ville *</label>
              <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} autoComplete="address-level2" required />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label htmlFor="comment">Commentaire / demande particulière</label>
              <textarea id="comment" name="comment" rows={3} value={formData.comment} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.pdfAction}>
            <button
              className="btn btn-primary"
              onClick={handleDownloadPdf}
              disabled={pdfLoading || !sessionForPdf || pdfSent}
            >
              {pdfLoading ? 'Génération…' : pdfSent ? '✓ Bulletin téléchargé' : '⬇ Télécharger le bulletin PDF'}
            </button>
            {pdfSent && sessionForPdf && (
              <button
                className={styles.retryLink}
                onClick={() => {
                  localStorage.removeItem(`pdf_sent_${sessionForPdf.id}`);
                  setPdfSent(false);
                }}
              >
                Une erreur dans le formulaire ? Re-télécharger
              </button>
            )}
            {!sessionForPdf && !loading && (
              <p className={styles.pdfDisabled}>
                Aucune session programmée pour ce type de stage — le bulletin sera disponible dès qu'une date sera fixée.
              </p>
            )}
            <p className={styles.pdfNote}>
              Imprimez ce bulletin, complétez-le et envoyez-le avec votre chèque d'acompte à :<br />
              <strong>Annick Le Goasteller, 3 Kermoal, 22340 Trébrivan</strong>.
            </p>
          </div>
        </section>

        </>)}

      </div>
    </main>
  );
}