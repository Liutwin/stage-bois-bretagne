/**
 * @file pages/HomePage.tsx
 * @description Page d'accueil du site Stage Bois Bretagne.
 *
 * Sections :
 * - Hero avec titre principal et CTA
 * - Trois piliers de la pédagogie
 * - Prochain stage (carte dynamique)
 * - Présentation courte de la formatrice
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SessionCard } from '@/components/SessionCard';
import { useSession } from '@/hooks/useSession';
import { PageSEO } from '@/components/PageSEO';
import { ReviewsSection } from '@/components/ReviewsSection';
import styles from '../styles/HomePage.module.css';
import annickPhoto from '../assets/annick.jpg';
import chantournagePhoto from '../assets/chantournage1.jpg';
import creation1Photo from '../assets/creation1.jpg';
import groupe1Photo from '../assets/groupe1.jpg';
import atelierEcolePhoto from '../assets/atelier-ecole.jpg';
import creationsPanelPhoto from '../assets/creations-panel.jpg';

const ATELIER_SLIDES = [
  { src: chantournagePhoto, alt: 'Travail de chantournage à l\'atelier' },
  { src: creation1Photo,    alt: 'Création en chantournage' },
  { src: groupe1Photo,      alt: 'Groupe de stagiaires à l\'atelier' },
  { src: atelierEcolePhoto, alt: 'L\'atelier école' },
];

/**
 * Page d'accueil publique.
 *
 * @returns Élément `<main>` de la page d'accueil.
 */
type Lightbox = { src: string; slides: typeof ATELIER_SLIDES };

export function HomePage() {
  const { session, loading } = useSession();
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(i => (i + 1) % ATELIER_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  function navigate(dir: 1 | -1) {
    if (!lightbox) return;
    const idx = lightbox.slides.findIndex(s => s.src === lightbox.src);
    const next = (idx + dir + lightbox.slides.length) % lightbox.slides.length;
    setLightbox({ src: lightbox.slides[next].src, slides: lightbox.slides });
  }

  return (
    <main>
      <PageSEO
        title="Stage Bois Bretagne — Chantournage Centre Bretagne"
        description="Stages de chantournage à Trébrivan, Centre Bretagne. Petits groupes, tous niveaux. Animé par Annick Le Goasteller."
        path="/"
      />
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.heroAccent} />
          <h1 className={styles.heroTitle}>
            Stages de<br />
            <em>chantournage</em><br />
            en Bretagne
          </h1>
          <p className={styles.heroDesc}>
            Stages d'initiation et de perfectionnement au chantournage, dans un environnement champêtre au cœur de la Bretagne,
            en petits groupes et dans une ambiance conviviale et chaleureuse.
          </p>
          <div className={styles.btnRow}>
            <Link to="/formules" className="btn btn-primary">
              Voir les formules
            </Link>
            <Link to="/stage" className="btn btn-outline">
              En savoir plus
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.carousel} aria-label="Photos de l'atelier">
            {ATELIER_SLIDES.map((slide, i) => (
              <div
                key={slide.src}
                className={`${styles.carouselSlide}${i === activeSlide ? ` ${styles.carouselSlideActive}` : ''}`}
                aria-hidden={i !== activeSlide}
                onClick={() => setLightbox({ src: slide.src, slides: ATELIER_SLIDES })}
              >
                <img src={slide.src} alt={slide.alt} />
              </div>
            ))}
            <div className={styles.carouselDots}>
              {ATELIER_SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.carouselDot}${i === activeSlide ? ` ${styles.carouselDotActive}` : ''}`}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === activeSlide}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Piliers ────────────────────────────────────────────────────────── */}
      <section className={styles.pillars}>
        <div className={styles.pillar}>
          <h3>Méthodes</h3>
          <p>
            Technicité, trucs et astuces maison délivrés sans restriction,
            en toute sécurité. Un apprentissage concret, loin des cours académiques,
            sur scies Hegner dont la réputation n'est plus à faire.
          </p>
        </div>
        <div className={styles.pillar}>
          <h3>Organisation</h3>
          <p>
            De 2 à 3 stagiaires par session (la session est annulée si il n'y a pas au moins 2 inscriptions)
          </p>
        </div>
        <div className={styles.pillar}>
          <h3>Créations</h3>
          <p>
            Mobiles, puzzles, objet décoratif ajouré, pièce d'échiquier, village en pyramides... et plus selon la vitesse de progression du groupe !
          </p>
        </div>
      </section>

      {/* ── Inscription ─────────────────────────────────────────────────── */}
      <section className={styles.nextSession}>
        <div className={styles.nextSessionInner}>
          <div>
            <p className="section-label">Disponibilités</p>
            <h2 className="section-title">Prochain stage</h2>
            <p className={styles.nextSessionDesc}>
              Annick organise 2 à 4 sessions par an. Les places sont limitées à 3 personnes — n'attendez pas pour réserver la vôtre.
            </p>
          </div>

          <div className={styles.cardWrapper}>
            {loading ? (
              <div className={styles.skeleton} aria-busy="true" aria-label="Chargement…" />
            ) : (
              <SessionCard session={session} variant="compact" />
            )}
          </div>
        </div>
      </section>

      {/* ── Panoramique créations ────────────────────────────────────────── */}
      <div className={styles.creationsPanel}>
        <img src={creationsPanelPhoto} alt="Créations des stagiaires" />
      </div>

      {/* ── Témoignages ──────────────────────────────────────────────────── */}
      <ReviewsSection />

      {/* ── Formatrice ────────────────────────────────────────────────────── */}
      <section className={styles.formatrice}>
        <div className={styles.portrait}>
          <img src={annickPhoto} alt="Portrait d'Annick" />
        </div>

        <div className={styles.bio}>
          <p className="section-label">Votre formatrice</p>
          <h2 className={styles.bioName}>Annick Le Goasteller</h2>
          <p className={styles.bioTitle}>Artisane et Formatrice</p>
          <p>
            Artisane d'art reconnue et créatrice pour les harpes celtiques CAMAC, Annick Le Goasteller partage sa passion du chantournage dans son atelier en Bretagne. 
          </p>
          <p>
            Des formations accessibles à tous, fondées sur la pratique et la transmission, pour progresser à son rythme dans une ambiance chaleureuse et repartir avec ses propres créations.
          </p>
          <Link to="/formatrice" className={styles.moreLink}>
            Découvrir son parcours →
          </Link>
        </div>
      </section>
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
