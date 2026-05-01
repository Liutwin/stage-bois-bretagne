import { useState, useEffect } from 'react';
import styles from '../styles/StaticPage.module.css';
import bungalowPhoto from '../assets/bungalow.jpg';
import chambrePhoto from '../assets/chambre.jpg';
import piqueniquePhoto from '../assets/pique-nique.jpg';
import { PageSEO } from '@/components/PageSEO';

const HEBERGEMENT_SLIDES = [
  { src: bungalowPhoto, alt: 'Le bungalow' },
  { src: chambrePhoto,  alt: 'La chambre' },
];

type Lightbox = { src: string; slides: typeof HEBERGEMENT_SLIDES };

export function HebergementPage() {
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(i => (i + 1) % HEBERGEMENT_SLIDES.length);
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
    <main className={styles.page}>
      <PageSEO
        title="Hébergement & Repas — Stage Bois Bretagne"
        description="Options d'hébergement et de restauration pour les participants au stage de chantournage à Trébrivan (Côtes-d'Armor)."
        path="/hebergement"
      />
      <div className={styles.inner}>
        <p className="section-label">Pratique</p>
        <h1 className="section-title">Hébergement &amp; Repas</h1>

        <div className={styles.content}>
          <div className={styles.hebergGrid}>

            <div className={styles.hebergPhoto}>
              <div className={styles.carousel}>
                {HEBERGEMENT_SLIDES.map((slide, i) => (
                  <div
                    key={slide.src}
                    className={`${styles.carouselSlide}${i === activeSlide ? ` ${styles.carouselSlideActive}` : ''}`}
                    onClick={() => setLightbox({ src: slide.src, slides: HEBERGEMENT_SLIDES })}
                    aria-hidden={i !== activeSlide}
                  >
                    <img src={slide.src} alt={slide.alt} />
                  </div>
                ))}
                <div className={styles.carouselDots}>
                  {HEBERGEMENT_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.carouselDot}${i === activeSlide ? ` ${styles.carouselDotActive}` : ''}`}
                      onClick={e => { e.stopPropagation(); setActiveSlide(i); }}
                      aria-label={`Photo ${i + 1}`}
                      aria-current={i === activeSlide}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.hebergPiqueNique}>
              <img src={piqueniquePhoto} alt="Pique-nique au jardin" />
            </div>

            {/* ── Sur place ─────────────────────────────────────────────── */}
            <section className={`${styles.block} ${styles.hebergRight}`}>
              <h2>Hébergement sur place</h2>
              <p>
                Dans un bungalow comprenant une chambre avec une kitchenette équipée,<br />
                des sanitaires et une terrasse, draps et serviettes fournis.<br />
                Minimum 2 nuits. Forfait de 90 € les deux premières nuits, 40 € la nuit supplémentaire.< br />
              </p>
            </section>

            <section className={`${styles.block} ${styles.hebergRight}`}>
              <p className={styles.note}>
                Les hébergements sur place sont confirmés 3 semaines avant le stage.
              </p>
            </section>

            {/* ── À proximité ───────────────────────────────────────────── */}
            <section className={`${styles.block} ${styles.hebergRight}`}>
              <h2>Hébergements à proximité</h2>
              <ul className={styles.list}>
                <li>
                  <strong>Chambres &amp; gîtes — Mme Florance Rivoal</strong> (2 km)<br />
                  <a href="tel:0296366940">02 96 36 69 40</a>
                  {' · '}
                  <a href="http://chambre-trebrivan.over-blog.com" target="_blank" rel="noopener noreferrer">
                    chambre-trebrivan.over-blog.com
                  </a>
                </li>
                <li>
                  <strong>Chambres — Mme Andrée Bluteau</strong> (600 m)<br />
                  <a href="tel:0607087645">06 07 08 76 45</a>
                </li>
              </ul>
            </section>

            {/* ── Repas ─────────────────────────────────────────────────── */}
            <section className={`${styles.block} ${styles.hebergRight}`}>
              <h2>Repas</h2>
              <p>La pause déjeuner se fait au choix de chacun :</p>
              <ul className={styles.list}>
                <li>Deux restaurants à 5 km — menus autour de 14 €</li>
                <li>Restauration rapide à Carhaix (10 km)</li>
                <li>Pique-nique possible au jardin aux beaux jours</li>
              </ul>
            </section>

          </div>
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
