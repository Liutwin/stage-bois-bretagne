import { useState } from 'react';
import styles from '../styles/StaticPage.module.css';
import gitePhoto from '../assets/gite.jpg';

export function HebergementPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <main className={styles.page}>
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
              <p>L'atelier dispose de deux hébergements directement sur place.</p>
            </section>

            <section className={`${styles.block} ${styles.hebergRight}`}>
              <h2>Gîte — deux chambres</h2>
              <p>
                Cuisine et sanitaires en commun.<br />
                <strong>100 €</strong> le forfait 4 nuits par chambre — 20 € la nuit supplémentaire.
              </p>
            </section>

            <section className={`${styles.block} ${styles.hebergRight}`}>
              <h2>Bungalow — une chambre</h2>
              <p>
                Kitchenette et sanitaires privatifs.<br />
                <strong>140 €</strong> le forfait 4 nuits — 25 € la nuit supplémentaire.
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
                  {' · '}
                  <a href="http://chez-dedee-trebrivan.fr" target="_blank" rel="noopener noreferrer">
                    chez-dedee-trebrivan.fr
                  </a>
                </li>
              </ul>
              <p className={styles.note}>
                Une liste complémentaire d'hébergements est envoyée sur demande à l'inscription.
              </p>
            </section>

            {/* ── Repas ─────────────────────────────────────────────────── */}
            <section className={`${styles.block} ${styles.hebergRight}`}>
              <h2>Repas</h2>
              <p>La pause déjeuner se fait au choix de chacun :</p>
              <ul className={styles.list}>
                <li>Deux restaurants à 5 km — menus autour de 12 €</li>
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
