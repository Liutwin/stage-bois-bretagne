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

import { Link } from 'react-router-dom';
import { SessionCard } from '@/components/SessionCard';
import { useSession } from '@/hooks/useSession';
import styles from './HomePage.module.css';

/**
 * Page d'accueil publique.
 *
 * @returns Élément `<main>` de la page d'accueil.
 */
export function HomePage() {
  const { session, loading } = useSession();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.heroAccent} />
          <h1 className={styles.heroTitle}>
            L'art de la<br />
            <em>scie à chantourner</em><br />
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
          {/* Placeholder — à remplacer par une vraie photo de l'atelier */}
          <div className={styles.heroPlaceholder}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
              <rect x="10" y="32" width="52" height="9" rx="3" fill="currentColor" opacity="0.4" />
              <rect x="27" y="10" width="9" height="52" rx="3" fill="currentColor" opacity="0.4" />
              <circle cx="36" cy="36" r="7" fill="currentColor" opacity="0.5" />
              <path d="M18 18 L54 54 M54 18 L18 54" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
            </svg>
            <span>Photo de l'atelier</span>
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
            Maximum 4 stagiaires par session pour s'adapter à tous les niveaux,
            des débutants complets aux pratiquants confirmés.
          </p>
        </div>
        <div className={styles.pillar}>
          <h3>Créations</h3>
          <p>
            Puzzles, jouets, mobiles, marquèterie, dentelle de bois, découpes 3D…
            laissez libre cours à votre imagination.
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
              à 4 personnes — n'attendez pas pour réserver la vôtre.
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
        <div className={styles.portrait} aria-hidden="true">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="20" r="11" fill="currentColor" opacity="0.3" />
            <path d="M4 50 C4 37 48 37 48 50" fill="currentColor" opacity="0.3" />
          </svg>
          <span>Portrait d'Annick</span>
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
            CAMAC — Stivell, Aziliz, Janet.
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
