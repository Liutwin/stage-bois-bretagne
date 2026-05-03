/**
 * @file components/SessionCard.tsx
 * @description Carte d'affichage du prochain stage avec badge de disponibilité.
 */

import type { Session } from '@/types/session';
import styles from '../styles/SessionCard.module.css';

/**
 * Props du composant {@link SessionCard}.
 */
interface SessionCardProps {
  /** Données de la session à afficher. `null` si aucun stage n'est programmé. */
  session: Session | null;
  /** Variante d'affichage : `compact` pour la page d'accueil, `full` pour la page dédiée. */
  variant?: 'compact' | 'full';
}

/**
 * Formate une date ISO 8601 en chaîne courte lisible en français.
 *
 * @param isoDate - Date au format `YYYY-MM-DD`.
 * @returns Ex : `"15 sept."` ou `"3 mai"`.
 */
function formatShortDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Formate une date ISO 8601 en chaîne longue lisible en français.
 *
 * @param isoDate - Date au format `YYYY-MM-DD`.
 * @returns Ex : `"15 septembre 2025"`.
 */
function formatLongDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Carte affichant les informations du prochain stage.
 *
 * - Affiche un message neutre si aucun stage n'est programmé (`session === null`).
 * - Badge vert si des places sont disponibles, rouge si complet.
 * - En variante `full`, affiche les dates complètes et un appel à l'action.
 *
 * @param props - {@link SessionCardProps}
 * @returns Élément de carte de session.
 *
 * @example
 * ```tsx
 * <SessionCard session={session} variant="compact" />
 * ```
 */
export function SessionCard({ session, variant = 'compact' }: SessionCardProps) {
  if (!session || !session.isVisible) {
    return (
      <div className={`${styles.card} ${styles.empty}`}>
        <span className={styles.emptyIcon}>✦</span>
        <p className={styles.emptyText}>
          Aucun stage n'est programmé pour l'instant.
          <br />
          Revenez bientôt ou{' '}
          <a href="/contact" className={styles.link}>
            contactez-nous
          </a>{' '}
          pour être informé(e) en priorité.
        </p>
      </div>
    );
  }

  const isFull = session.spotsAvailable === 0;
  const startShort = formatShortDate(session.startDate);
  const endShort = formatShortDate(session.endDate);
  const startLong = formatLongDate(session.startDate);
  const endLong = formatLongDate(session.endDate);

  return (
    <div className={`${styles.card} ${variant === 'full' ? styles.full : ''}`}>
      {/* Bandeau de date */}
      <div className={styles.dateBar}>
        <span className={styles.dateRange}>
          {startShort} – {endShort}
        </span>
        <span className={`${styles.badge} ${isFull ? styles.badgeFull : styles.badgeOk}`}>
          {isFull ? 'Complet' : `${session.spotsAvailable} place${session.spotsAvailable > 1 ? 's' : ''} disponible${session.spotsAvailable > 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Corps */}
      <div className={styles.body}>
        <h3 className={styles.theme}>{session.theme}</h3>

        {variant === 'full' && (
          <>
            <p className={styles.dateFull}>
              Du {startLong} au {endLong}
            </p>
            <ul className={styles.details}>
              <li>
                <strong>Places :</strong> {session.spotsAvailable} / {session.totalSpots}
              </li>
              <li>
                <strong>Lieu :</strong> 3 Kermoal, 22340 Trébrivan
              </li>
            </ul>
          </>
        )}
      </div>

      {/* CTA */}
      {!isFull && (
        <div className={styles.cta}>
          <a href="/inscription#formulaire" className="btn btn-primary">
            S'inscrire
          </a>
          {variant === 'full' && (
            <a href="/contact" className="btn btn-outline">
              Poser une question
            </a>
          )}
        </div>
      )}
    </div>
  );
}
