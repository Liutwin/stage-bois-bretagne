import { useState, useEffect } from 'react';
import styles from '../styles/StaticPage.module.css';
import annickPhoto from '../assets/annick.jpg';
import annickSculpturePhoto from '../assets/annick-sculpture.jpg';
import annickCamacPhoto from '../assets/annick-et-camac.jpg';
import annickAuQuartzPhoto from '../assets/annick-au-quartz.jpg';
import boutique1Photo from '../assets/boutique1.jpg';
import boutique2Photo from '../assets/boutique2.jpg';
import { PageSEO } from '@/components/PageSEO';

const CAROUSEL_SLIDES = [
  { src: annickCamacPhoto,    alt: 'Annick avec une harpe CAMAC' },
  { src: annickAuQuartzPhoto, alt: 'Annick au quartz' },
  { src: boutique1Photo,      alt: 'Boutique' },
  { src: boutique2Photo,      alt: 'Boutique' },
];

type Lightbox =
  | { src: string; slides: null }
  | { src: string; slides: typeof CAROUSEL_SLIDES };

export function FormatricePage() {
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(i => (i + 1) % CAROUSEL_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  function openCarousel(src: string) {
    setLightbox({ src, slides: CAROUSEL_SLIDES });
  }

  function navigate(dir: 1 | -1) {
    if (!lightbox?.slides) return;
    const idx = lightbox.slides.findIndex(s => s.src === lightbox.src);
    const next = (idx + dir + lightbox.slides.length) % lightbox.slides.length;
    setLightbox({ src: lightbox.slides[next].src, slides: lightbox.slides });
  }

  return (
    <main className={styles.page}>
      <PageSEO
        title="Annick Le Goasteller, formatrice — Stage Bois Bretagne"
        description="Découvrez le parcours d'Annick Le Goasteller, artisane sculptrice et formatrice en chantournage en Centre Bretagne."
        path="/formatrice"
      />
      <div className={styles.inner}>
        <p className="section-label">Votre formatrice</p>
        <h1 className="section-title">Annick Le Goasteller</h1>

        <div className={styles.content}>
          <div className={styles.profileGrid}>

            <div className={styles.portraits}>
              <div className={`${styles.portraitLarge} ${styles.portraitStatic} ${styles.mob1}`}>
                <img src={annickPhoto} alt="Annick" />
              </div>

              <div
                className={`${styles.portraitLarge} ${styles.portraitWide} ${styles.mob3}`}
                onClick={() => setLightbox({ src: annickSculpturePhoto, slides: null })}
              >
                <img src={annickSculpturePhoto} alt="Sculpture en bois par Annick" />
              </div>

              <div className={`${styles.portraitCarousel} ${styles.mob4}`}>
                <div className={styles.carousel}>
                  {CAROUSEL_SLIDES.map((slide, i) => (
                    <div
                      key={slide.src}
                      className={`${styles.carouselSlide}${i === activeSlide ? ` ${styles.carouselSlideActive}` : ''}`}
                      onClick={() => openCarousel(slide.src)}
                      aria-hidden={i !== activeSlide}
                    >
                      <img src={slide.src} alt={slide.alt} />
                    </div>
                  ))}
                  <div className={styles.carouselDots}>
                    {CAROUSEL_SLIDES.map((_, i) => (
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
                  Depuis près de quarante ans, le bois accompagne chacun de mes gestes. Pourtant, rien ne me prédestinait à cette matière vivante. Dès mon plus jeune âge, je me suis passionnée pour les activités manuelles, encouragée par mon père qui m'a transmis le goût du travail bien fait et le maniement des outils — et c'est cette curiosité qui m'a conduite à explorer des domaines aussi variés que la peinture sur soie, le rotin, le cuir, les émaux grand feu, le verre ou encore les bijoux. Autant d'explorations qui ont nourri ma sensibilité et affiné mon regard.
                </p>
                <p>
                  Puis un stage de lutherie dans les Vosges chez{' '}
                  <a href="http://www.nyckelharpa-condi.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Jean-Claude Condi</a>
                  {' '}a tout changé : j'ai découvert le bois comme on fait une rencontre décisive — une évidence. Depuis ce jour, je ne l'ai plus quitté. Pour maîtriser les machines d'atelier, j'ai suivi plusieurs formations au{' '}
                  <a href="https://web.archive.org/web/20250331030609/https://bel-if.fr" target="_blank" rel="noopener noreferrer" className={styles.link}>Centre du Bel If</a>
                  , me formant à la menuiserie, à la sculpture, à la marqueterie et au tournage.
                </p>
                <p>
                  Pendant quinze ans, j'ai fabriqué des jouets en bois originaux, des créations durables et intemporelles, très appréciées des enfants. Peu à peu, mon univers s'est orienté vers des objets décoratifs en bois massif de pays — découpé, sculpté — nourris par la Bretagne, l'imaginaire celtique et la mer.
                </p>
                <p>
                  Chaque pièce naît d'un bois choisi avec soin. Je le fais débiter en scierie, le laisse sécher lentement, puis je le débite et le rabote avec une combinée à bois.
                </p>
                <p>
                  Le processus créatif commence par le dessin ; viennent ensuite la découpe, la moulure, la sculpture et le ponçage, jusqu'à la naissance de l'œuvre. L'huile, en dernier, révèle toute la profondeur du veinage. Chaque création devient ainsi une pièce unique, façonnée par le temps, la main et la matière.
                </p>
                <p>
                  Je crée également des boucles d'oreilles en bois précieux, en pétales recouverts de résine ou en pierres semi-précieuses, montées sur argent et rehaussées de cristaux Swarovski : des fragments de nature à porter sur soi.
                </p>
                <p>
                  Depuis plus de vingt ans, j'ai le privilège de collaborer avec{' '}
                  <a href="https://www.camac-harps.com" target="_blank" rel="noopener noreferrer" className={styles.link}>CAMAC</a>
                  , leader mondial de la harpe celtique, pour lequel je réalise les décors des séries{' '}
                  <a href="https://nl.camac-harps.com/wp-content/uploads/sites/14/2019/05/photo-2019-05-16-11-39-18.jpg" target="_blank" rel="noopener noreferrer" className={styles.link}>Stivell</a>
                  ,{' '}
                  <a href="https://be.camac-harps.com/wp-content/uploads/sites/3/2016/10/Aziliz-emerald-shamrock-finish-.jpg" target="_blank" rel="noopener noreferrer" className={styles.link}>Aziliz</a>
                  {' '}et{' '}
                  <a href="https://www.camac-harps.com/fr/harps-fr/lever-fr/janet" target="_blank" rel="noopener noreferrer" className={styles.link}>Janet</a>
                  . Voir mes motifs accompagner la musique reste une émotion toujours renouvelée.
                </p>
                <p>
                  Participer à des salons, exposer en boutiques et galeries, répondre à des commandes de trophées… autant de facettes d'un métier que j'exerce avec le même enthousiasme qu'au premier jour.
                </p>
                <p>
                  Et transmettre est devenu, lui aussi, un pan passionnant de cette aventure : depuis près de vingt ans, j'accueille des stagiaires venus de toute la France, mais aussi de Belgique, d'Allemagne et de Suisse, pour partager l'art du chantournage, la patience du geste et le plaisir de créer de ses mains.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          {lightbox.slides && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={e => { e.stopPropagation(); navigate(-1); }}
              aria-label="Photo précédente"
            >&#8249;</button>
          )}
          <img src={lightbox.src} alt="" />
          {lightbox.slides && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={e => { e.stopPropagation(); navigate(1); }}
              aria-label="Photo suivante"
            >&#8250;</button>
          )}
        </div>
      )}
    </main>
  );
}
