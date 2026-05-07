import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/StaticPage.module.css';
import stageStyles from '../styles/StagePage.module.css';
import chantournage2Photo from '../assets/chantournage2.jpg';
import perceusePhoto from '../assets/travail-perceuse.jpg';
import groupe2Photo from '../assets/groupe2.jpg';
import groupe3Photo from '../assets/groupe3.jpg';
import groupe4Photo from '../assets/groupe4.jpg';
import groupe5Photo from '../assets/groupe5.jpg';
import travailAtelierPhoto from '../assets/travail-atelier.jpg';
import chantournage3Photo from '../assets/chantournage3.jpg';
import travailMarteauPhoto from '../assets/travail-marteau.jpg';
import travailEtauPhoto from '../assets/travail-etau.jpg';
import travailGroupePhoto from '../assets/travail-groupe.jpg';
import { PageSEO } from '@/components/PageSEO';

const AUDIENCE = [
  {
    title: 'Néophytes',
    desc: 'Vous souhaitez découvrir le travail du bois en vous faisant très vite plaisir.',
  },
  {
    title: 'Professionnels du bois',
    desc: 'Menuisier, ébéniste, tourneur, sculpteur… vous voulez apprendre une nouvelle technique.',
  },
  {
    title: 'Encadrants',
    desc: 'Personnel médico-social, animateurs, éducateurs : vous cherchez un atelier attractif et sans danger pour vos publics.',
  },
  {
    title: 'Utilisateurs confirmés',
    desc: "Vous possédez déjà une scie à chantourner et souhaitez l'utiliser de façon plus pointue.",
  },
  {
    title: 'Retraités, personnes au foyer',
    desc: 'Vous cherchez une activité attrayante, manuelle, et profondément gratifiante.',
  },
  {
    title: 'En reconversion',
    desc: "Vous explorez un complément d'activité ou une nouvelle voie professionnelle dans l'artisanat.",
  },
];

const STANDALONE_PHOTOS = [
  { src: chantournage2Photo, alt: "Travail de chantournage à l'atelier", wide: false, portrait: false },
  { src: perceusePhoto,      alt: "Perceuse sur colonne dans l'atelier", wide: false, portrait: false },
];

const GALLERY_PHOTOS = [
  { src: travailGroupePhoto,  alt: 'Le groupe en atelier',      wide: true,    portrait: false },
  { src: travailAtelierPhoto, alt: 'Travail en atelier',        wide: false,   portrait: false },
  { src: travailEtauPhoto,    alt: "Travail à l'étau",          wide: false,   portrait: true  },
  { src: travailMarteauPhoto, alt: 'Travail au marteau',        wide: false,   portrait: false },
  { src: chantournage3Photo,  alt: 'Scie à chantourner',        wide: false,   portrait: false },
];

const GALLERY_ROWS = [
  { items: GALLERY_PHOTOS.slice(0, 2), rowClass: stageStyles.galleryRow1 },
  { items: GALLERY_PHOTOS.slice(2, 5), rowClass: stageStyles.galleryRow2 },
];

const ALL_PHOTOS = [...STANDALONE_PHOTOS, ...GALLERY_PHOTOS];

const GROUPE_PHOTOS = [
  { src: groupe2Photo, alt: 'Session en atelier' },
  { src: groupe3Photo, alt: 'Session en atelier' },
  { src: groupe4Photo, alt: 'Session en atelier' },
  { src: groupe5Photo, alt: 'Session en atelier' },
];

type Lightbox = { src: string; slides: { src: string }[] };

export function StagePage() {
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx(i => (i + 1) % GROUPE_PHOTOS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  function navigate(dir: 1 | -1) {
    if (!lightbox?.slides) return;
    const idx = lightbox.slides.findIndex(s => s.src === lightbox.src);
    const next = (idx + dir + lightbox.slides.length) % lightbox.slides.length;
    setLightbox({ src: lightbox.slides[next].src, slides: lightbox.slides });
  }

  return (
    <main className={styles.page}>
      <PageSEO
        title="Le stage de chantournage — Stage Bois Bretagne"
        description="Découvrez le programme du stage : techniques de chantournage, matériel fourni et déroulement des journées à Trébrivan (22)."
        path="/stage"
      />
      <div className={styles.inner}>
        <p className="section-label">Le stage</p>
        <h1 className="section-title">Découvrez le chantournage</h1>

        <div className={styles.content}>

          {/* ── Intro + photo ─────────────────────────────────────────────── */}
          <div className={stageStyles.intro}>
            <section className={styles.block}>
              <h2>« Chantournage », mais qu'est-ce donc ?</h2>
              <p>
                C'est une technique de découpe fine du bois réalisée à la scie à chantourner,
                cette merveilleuse machine aux étonnantes possibilités ! Elle permet de créer
                des formes délicates, ajourées et très précises.
              </p>
              <p style={{ marginTop: '.75rem' }}>
                Créations : Mobile, puzzle, jouet, objet décoratif ajouré, pièce d'échiquier, village en pyramide... et plus selon la vitesse de progression du groupe !
              </p>
              <p style={{ marginTop: '.75rem' }}>
                Loin des enseignements académiques, l'apprentissage se fait au plus près des
                réalités du métier : technicité, trucs et astuces maison délivrés sans
                restriction, dans une ambiance conviviale et chaleureuse.
              </p>
            </section>
            <div
              className={stageStyles.introPhoto}
              style={{ cursor: 'pointer' }}
              onClick={() => setLightbox({ src: chantournage2Photo, slides: ALL_PHOTOS })}
            >
              <img src={chantournage2Photo} alt="Travail de chantournage à l'atelier" />
            </div>
          </div>

          {/* ── Pour qui ──────────────────────────────────────────────────── */}
          <section className={styles.block}>
            <h2>Un stage pour tous</h2>
            <div className={stageStyles.audienceGrid}>
              {AUDIENCE.map(({ title, desc }) => (
                <div key={title} className={stageStyles.audienceCard}>
                  <div className={stageStyles.audienceIcon}>◎</div>
                  <div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── L'atelier ─────────────────────────────────────────────────── */}
          <section className={`${styles.block} ${stageStyles.atelier}`}>
            <div>
              <h2>L'atelier, au plus près de la réalité</h2>
              <p>
                L'atelier est celui d'Annick — conforme aux normes de sécurité, c'est
                l'espace dans lequel elle exerce son métier d'artisane d'art au quotidien.
                Vous êtes au plus près de la réalité professionnelle.
              </p>
              <p style={{ marginTop: '.75rem' }}>
                Chaque stagiaire dispose de son propre poste de travail, équipé d'une scie
                à chantourner <strong>Hegner</strong>, dont la réputation de qualité n'est plus à faire.
              </p>
              <p style={{ marginTop: '.75rem' }}>
                En commun : perceuses sur colonne et électroportative, outils manuels de base.
                Avec explications sur chaque machine de l'atelier : scie à ruban, combinée, défonceuse.
              </p>
            </div>
            <div
              className={stageStyles.atelierPhoto}
              style={{ cursor: 'pointer' }}
              onClick={() => setLightbox({ src: perceusePhoto, slides: ALL_PHOTOS })}
            >
              <img src={perceusePhoto} alt="Perceuse sur colonne dans l'atelier" />
            </div>
          </section>

          {/* ── Déroulement ───────────────────────────────────────────────── */}
          <section className={styles.block}>
            <h2>Déroulement</h2>
            <p>
              Les sessions se déroulent en général de 9h30 à 12h30 et de 13h30 à 16h30,
              ou de 9h à 12h30 et de 13h30 à 17h selon les formules.
              Le nombre de stagiaires est volontairement limité à <strong>3 personnes maximum</strong>,
              afin qu'Annick puisse s'adapter au niveau et au rythme de chacun.
            </p>
            <p style={{ marginTop: '.75rem' }}>
              Le programme est commun à tous les participants, débutants comme confirmés.
              Pour chaque thème, plusieurs modèles de niveaux différents sont proposés —
              chacun avance à son rythme et repart avec ses propres créations.
            </p>
          </section>

          {/* ── Galerie photos ────────────────────────────────────────────── */}
          <section className={styles.block}>
            <h2>L'atelier en images</h2>
            <div className={stageStyles.gallery}>
              {GALLERY_ROWS.map((row, ri) => (
                <div key={ri} className={`${stageStyles.galleryRow} ${row.rowClass}`}>
                  {row.items.map((photo) => (
                    <div
                      key={photo.src}
                      className={[
                        stageStyles.galleryItem,
                        photo.portrait ? stageStyles.galleryItemPortrait : '',
                        photo.wide     ? stageStyles.galleryItemWide     : '',
                      ].join(' ')}
                      onClick={() => setLightbox({ src: photo.src, slides: ALL_PHOTOS })}
                    >
                      <img src={photo.src} alt={photo.alt} />
                      <div className={stageStyles.galleryCaption}>{photo.alt}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* ── Carrousel groupe ─────────────────────────────────────────── */}
          <section className={styles.block}>
            <h2>Réalisations des stagiaires</h2>
            <div className={stageStyles.slideCarousel}>
              <div
                className={stageStyles.slideTrack}
                style={{ transform: `translateX(-${carouselIdx * 100}%)` }}
              >
                {GROUPE_PHOTOS.map((photo) => (
                  <div
                    key={photo.src}
                    className={stageStyles.slideItem}
                    onClick={() => setLightbox({ src: photo.src, slides: GROUPE_PHOTOS })}
                  >
                    <img src={photo.src} alt={photo.alt} />
                  </div>
                ))}
              </div>
              <div className={stageStyles.slideDots}>
                {GROUPE_PHOTOS.map((_, i) => (
                  <button
                    key={i}
                    className={`${stageStyles.slideDot}${i === carouselIdx ? ` ${stageStyles.slideDotActive}` : ''}`}
                    onClick={() => setCarouselIdx(i)}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── Citation ─────────────────────────────────────────────────── */}
          <div className={stageStyles.quoteBlock}>
            <p className={stageStyles.quoteText}>Laissez libre cours à votre imagination</p>
            <div className={stageStyles.quoteAccent} />
          </div>

          {/* ── CTA ───────────────────────────────────────────────────────── */}
          <section className={styles.block} style={{ paddingTop: '.5rem' }}>
            <Link to="/formules" className="btn btn-primary">Voir nos formules →</Link>
          </section>

        </div>
      </div>

      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={e => { e.stopPropagation(); navigate(-1); }}
            aria-label="Photo précédente"
          >&#8249;</button>
          <img src={lightbox.src} alt="" />
          <button
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            onClick={e => { e.stopPropagation(); navigate(1); }}
            aria-label="Photo suivante"
          >&#8250;</button>
        </div>
      )}
    </main>
  );
}
