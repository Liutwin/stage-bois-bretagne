/**
 * @file pages/FormatricePage.tsx
 * @description Page biographique d'Annick Le Goasteller, artisane et formatrice.
 */

import { useState } from 'react';
import styles from '../styles/StaticPage.module.css';
import annickPhoto from '../assets/annick.jpg';
import annickSculpturePhoto from '../assets/annick-sculpture.jpg';
import annickCamacPhoto from '../assets/annick-et-camac.jpg';
import ambiancePhoto from '../assets/ambiance-stage.jpg';

export function FormatricePage() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className="section-label">Votre formatrice</p>
        <h1 className="section-title">Annick Le Goasteller</h1>

        <div className={styles.content}>
          {/*
            Desktop : .portraits couvre toute la col 1 (grid-row: 1/-1), flex-column gap → photos serrées.
            Mobile  : .portraits devient display:contents, les photos entrent dans le flux du grid.
                      Les classes .mobN rétablissent l'ordre interleaved via CSS order.
          */}
          <div className={styles.profileGrid}>

            <div className={styles.portraits}>
              <div className={`${styles.portraitLarge} ${styles.mob1}`} onClick={() => setLightbox(annickPhoto)}>
                <img src={annickPhoto} alt="Annick" />
              </div>
              <div className={`${styles.portraitLarge} ${styles.portraitWide} ${styles.mob3}`} onClick={() => setLightbox(annickSculpturePhoto)}>
                <img src={annickSculpturePhoto} alt="Sculpture en bois par Annick" />
              </div>
              <div className={`${styles.portraitLarge} ${styles.portraitWide} ${styles.mob5}`} onClick={() => setLightbox(annickCamacPhoto)}>
                <img src={annickCamacPhoto} alt="Annick avec une harpe CAMAC" />
              </div>
              <div className={`${styles.portraitLarge} ${styles.portraitWide} ${styles.mob7}`} onClick={() => setLightbox(ambiancePhoto)}>
                <img src={ambiancePhoto} alt="Ambiance d'un stage de chantournage" />
              </div>
            </div>

            <div className={styles.mob2}>
              <p className={styles.subtitle}>Artisane &amp; Formatrice · Trébrivan, Bretagne</p>
              <section className={styles.block}>
                <h2>Parcours</h2>
                <p>
                  Établie à Trébrivan, Annick Le Goasteller est une artisane d'art
                  dont le parcours témoigne d'une curiosité insatiable.
                  Formée aux bases du travail manuel par son père, elle a exploré de multiples savoir-faire
                  — de la peinture sur soie au rotin, en passant par la céramique, le cuir, les émaux,
                  le verre, la joaillerie et la peinture à l'huile — avant de trouver sa véritable vocation.
                </p>
                <p>
                  Il y a trente ans, un stage de lutherie dans les Vosges chez Jean-Claude Condi marque
                  le début de sa passion exclusive pour le bois. Après s'être perfectionnée au maniement
                  des machines d'atelier au Centre du Bel If, elle est devenue une experte du chantournage,
                  alliant aujourd'hui technicité et sensibilité artistique au cœur de la Bretagne.
                </p>
              </section>
            </div>

            <section className={`${styles.block} ${styles.mob4}`}>
              <h2>Références</h2>
              <blockquote className={styles.quote}>
                Elle réalise les décors des harpes celtiques pour les prestigieuses
                harpes CAMAC Stivell et Aziliz.
              </blockquote>
              <p>
                Annick participe à des salons, expose en boutiques et galeries,
                et est régulièrement sollicitée pour la réalisation de trophées
                personnalisés pour collectivités et entreprises.
              </p>
            </section>

            <section className={`${styles.block} ${styles.mob6}`}>
              <h2>Pédagogie</h2>
              <p>
                Sa méthode repose sur le partage sans retenue de ses techniques et
                astuces maison. Elle favorise la pratique immédiate sur des projets
                personnels, dans une ambiance chaleureuse et bienveillante.
              </p>
            </section>

          </div>

          <div className={styles.block}>
            <h2>En vidéo</h2>
            <div className={styles.videoWrapper}>
              <iframe
                src="https://www.youtube.com/embed/BGkxX_3Wuic"
                title="Annick Le Goasteller — chantournage"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
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
