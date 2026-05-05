import { useState, useEffect } from 'react';
import { fetchTestimonials, fetchPlaceRating } from '@/utils/api';
import type { Testimonial, PlaceRating } from '@/types/session';
import styles from '../styles/ReviewsSection.module.css';

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Stage+Bois+Bretagne+Trébrivan';

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`${rating} étoiles sur 5`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

function ReviewCard({ t }: { t: Testimonial }) {
  const initial = t.author.trim().charAt(0).toUpperCase() || '?';
  return (
    <div className={styles.card}>
      <Stars rating={t.rating} />
      <p className={styles.cardText}>« {t.text} »</p>
      <div className={styles.cardAuthor}>
        <div className={styles.avatar} aria-hidden="true">{initial}</div>
        <div>
          <div className={styles.authorName}>{t.author}</div>
          {t.dateLabel && <div className={styles.authorDate}>{t.dateLabel}</div>}
        </div>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [placeRating, setPlaceRating]   = useState<PlaceRating | null>(null);

  useEffect(() => {
    fetchTestimonials().then(setTestimonials).catch(() => {});
    fetchPlaceRating().then(setPlaceRating).catch(() => {});
  }, []);

  const visible = testimonials.filter(t => t.isVisible && t.text.trim().length > 0);
  if (visible.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className="section-label">Témoignages</p>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Ce qu'ils en disent</h2>
        </div>
        {placeRating && (
          <div className={styles.badge}>
            <div className={styles.badgeStars}>{'★'.repeat(Math.round(placeRating.rating))}</div>
            <div className={styles.badgeScore}>
              {placeRating.rating.toFixed(1)}{' '}
              <span className={styles.badgeCount}>· {placeRating.userRatingsTotal} avis Google</span>
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              className={styles.badgeLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir tous les avis →
            </a>
          </div>
        )}
      </div>

      <div className={`${styles.grid} ${visible.length < 3 ? styles.gridCentered : ''}`}>
        {visible.map(t => <ReviewCard key={t.slot} t={t} />)}
      </div>

      {placeRating?.reviewUrl && (
        <div className={styles.cta}>
          <a
            href={placeRating.reviewUrl}
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Laisser un avis Google
          </a>
        </div>
      )}
    </section>
  );
}
