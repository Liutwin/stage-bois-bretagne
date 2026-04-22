/**
 * @file pages/FormatricePage.tsx
 * @description Page biographique d'Annick Le Goasteller, artisane et formatrice.
 */

import { useState, useEffect } from 'react';
import styles from '../styles/StaticPage.module.css';
import annickPhoto from '../assets/annick.jpg';
import annickSculpturePhoto from '../assets/annick-sculpture.jpg';
import annickCamacPhoto from '../assets/annick-et-camac.jpg';
import ambiancePhoto from '../assets/ambiance-stage.jpg';

const GALLERY_SLIDES = [
  { src: annickSculpturePhoto, alt: 'Sculpture en bois par Annick' },
  { src: annickCamacPhoto,     alt: 'Annick avec une harpe CAMAC' },
  { src: ambiancePhoto,        alt: 'Ambiance d\'un stage de chantournage' },
];

export function FormatricePage() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(i => (i + 1) % GALLERY_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className="section-label">Votre formatrice</p>
        <h1 className="section-title">Annick Le Goasteller</h1>

        <div className={styles.content}>
          <div className={styles.profileGrid}>

            <div className={styles.portraits}>
              <div className={`${styles.portraitLarge} ${styles.mob1}`} onClick={() => setLightbox(annickPhoto)}>
                <img src={annickPhoto} alt="Annick" />
              </div>

              <div className={`${styles.portraitCarousel} ${styles.mob3}`}>
                <div className={styles.carousel}>
                  {GALLERY_SLIDES.map((slide, i) => (
                    <div
                      key={slide.src}
                      className={`${styles.carouselSlide}${i === activeSlide ? ` ${styles.carouselSlideActive}` : ''}`}
                      onClick={() => setLightbox(slide.src)}
                      aria-hidden={i !== activeSlide}
                    >
                      <img src={slide.src} alt={slide.alt} />
                    </div>
                  ))}
                  <div className={styles.carouselDots}>
                    {GALLERY_SLIDES.map((_, i) => (
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
            </div>

            <div className={styles.mob2}>
              <p className={styles.subtitle}>Le bois, la mer et l'âme celtique</p>
              <section className={styles.block}>
                <h2>Parcours</h2>
                <p>
                  Depuis près de quarante ans, le bois accompagne chacun de mes gestes. Pourtant, rien ne me prédestinait à cette matière vivante. Avant lui, il y eut la soie, le rotin, le cuir, les émaux grand feu… autant d’explorations qui ont nourri ma sensibilité et mon regard. Puis un stage de lutherie dans les Vosges a changé le cours des choses. Là, j’ai découvert le bois comme on fait une rencontre décisive : une évidence. Depuis ce jour, je ne l’ai plus quitté.
                </p>

                <p>
                  Je me suis formée à la menuiserie d’atelier, à la sculpture, à la marqueterie et au tournage. Pendant quinze ans, j’ai fabriqué des jouets en bois originaux, des créations durables et intemporelles très appréciées des enfants. Peu à peu, mon univers s’est orienté vers la création d’objets décoratifs en bois massif de pays, découpé et sculpté, inspirés par les terres bretonnes, l’imaginaire celtique et la mer.
                </p>

                <p>
                  Chaque pièce naît d’un bois que je choisis avec soin. Je le fais débiter en scierie, puis sécher lentement chez moi, avant de le raboter. Le processus créatif débute par le dessin ; viennent ensuite la découpe, la moulure, la sculpture et le ponçage, jusqu’à la naissance de l’œuvre. Enfin, l’huile révèlera la profondeur du veinage.
                </p>

                <p>
                  Ainsi, chaque création devient une pièce unique, façonnée par le temps, la main et la matière.
                </p>

                <p>
                  Je crée également des boucles d'oreilles en bois précieux, en pétales recouverts de résine, en pierres semi-précieuses, montées sur argent et agrémentés par des cristaux Swarovski : des fragments de nature à porter sur soi.
                </p>

                <p>
                  Depuis plus de vingt ans, j’ai le privilège de collaborer avec Camac, leader mondial des prestigieuses harpes celtiques, pour lequel je réalise les décors des séries Stivell, Aziliz et Janet. Voir mes motifs accompagner la musique est une émotion toujours renouvelée.
                </p>

                <p>
                  Transmettre est devenu également une part passionnante de mon métier. Depuis près de vingt ans, j’accueille en Bretagne des stagiaires venus de toute la France, mais aussi de Belgique, d'Allemagne, de Suisse, pour partager l’art du chantournage, la patience du geste et le plaisir de créer de ses mains.
                </p>
              </section>
            </div>
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
