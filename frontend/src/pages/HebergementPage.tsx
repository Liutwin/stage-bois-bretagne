import { useState } from 'react';
import styles from '../styles/StaticPage.module.css';
import gitePhoto from '../assets/gite.jpg';
import { PageSEO } from '@/components/PageSEO';

export function HebergementPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);

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

            <div className={styles.hebergPhoto} onClick={() => setLightbox(gitePhoto)}>
              <img src={gitePhoto} alt="Le gîte" />
            </div>

            {/* ── Sur place ─────────────────────────────────────────────── */}
            <section className={`${styles.block} ${styles.hebergRight}`}>
              <h2>Hébergement sur place</h2>
              <p>
                Dans un bungallow comprenant une chambre avec une kitchette entièrement équipée,<br />
                des sanitaires et une terrasse, draps et serviettes fournis.<br />
                Minimum 2 nuits. Forfait de 90 € les deux premières nuits, 40 € la nuit supplémentaire.< br />

              </p>
            </section>

            <div className={`${styles.carouselPlaceholder} ${styles.hebergPlaceholder}`}>
              Photos à venir
            </div>

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
          <img src={lightbox} alt="" />
        </div>
      )}
    </main>
  );
}
