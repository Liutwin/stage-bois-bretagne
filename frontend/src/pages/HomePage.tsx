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
import styles from '../styles/HomePage.module.css';
import annickPhoto from '../assets/annick.jpg';
import chantournagePhoto from '../assets/chantournage.jpg';
import collagePhoto from '../assets/collage.jpg';
import poncagePhoto from '../assets/poncage.jpg';

const ATELIER_SLIDES = [
  { src: chantournagePhoto, alt: 'Travail de chantournage à l\'atelier' },
  { src: collagePhoto,      alt: 'Collage à l\'atelier' },
  { src: poncagePhoto,      alt: 'Ponçage à l\'atelier' },
];

/**
 * Page d'accueil publique.
 *
 * @returns Élément `<main>` de la page d'accueil.
 */
export function HomePage() {
  const { session, loading } = useSession();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(i => (i + 1) % ATELIER_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

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
            Stage de<br />
            <em>chantournage</em><br />
            en Bretagne
          </h1>
          <p className={styles.heroDesc}>
            Stages d'initiation et de perfectionnement au chantournage,
            dans un cadre champêtre au cœur de la Bretagne.
            Petits groupes, ambiance conviviale.
          </p>
          <div className={styles.btnRow}>
            <Link to="/prochain-stage" className="btn btn-primary">
              Voir le prochain stage
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
            en toute sécurité. Un apprentissage concret, loin des cours académiques.
          </p>
        </div>
        <div className={styles.pillar}>
          <h3>Organisation</h3>
          <p>
            Maximum 3 stagiaires par session.
          </p>
        </div>
        <div className={styles.pillar}>
          <h3>Créations</h3>
          <p>
            Mobiles, puzzles, découpes de précision,
            et plus selon la vitesse de progression du groupe.
          </p>
        </div>
      </section>

      {/* ── Prochain stage ─────────────────────────────────────────────────── */}
      <section className={styles.nextSession}>
        <div className={styles.nextSessionInner}>
          <div>
            <p className="section-label">Disponibilités</p>
            <h2 className="section-title">Prochain stage</h2>
            <p className={styles.nextSessionDesc}>
              Annick organise 1 à 3 sessions par an. Les places sont limitées
              à 3 personnes — n'attendez pas pour réserver la vôtre.
            </p>
            <Link to="/prochain-stage" className={styles.moreLink}>
              Voir toutes les informations →
            </Link>
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

      {/* ── Formatrice ────────────────────────────────────────────────────── */}
      <section className={styles.formatrice}>
        <div className={styles.portrait}>
          <img src={annickPhoto} alt="Portrait d'Annick" />
        </div>

        <div className={styles.bio}>
          <p className="section-label">Votre formatrice</p>
          <h2 className={styles.bioName}>Annick Le Goasteller</h2>
          <p className={styles.bioTitle}>Artisane &amp; Formatrice</p>
          <p>
            Annick participe à de nombreux salons, expose en boutiques et galeries,
            et est régulièrement sollicitée pour la réalisation de trophées personnalisés.
          </p>
          <blockquote className={styles.quote}>
            Elle réalise les décors des harpes celtiques pour les prestigieuses harpes
            CAMAC Stivell et Aziliz.
          </blockquote>
          <p>
            Sa pédagogie, fondée sur la pratique immédiate et le partage sans retenue,
            permet à chacun de progresser à son rythme dans une ambiance chaleureuse.
          </p>
          <Link to="/formatrice" className={styles.moreLink}>
            Découvrir son parcours →
          </Link>
        </div>
      </section>
    </main>
  );
}
