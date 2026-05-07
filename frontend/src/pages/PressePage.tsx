import { useState } from 'react';
import styles from '../styles/StaticPage.module.css';
import pressStyles from '../styles/PressePage.module.css';
import { PageSEO } from '@/components/PageSEO';

import imgFlaneur from '../assets/presse/flaneur-argoat.jpg';
import imgLutun from '../assets/presse/lutun-des-bois.jpg';
import imgPerspectives from '../assets/presse/perspectives.jpg';
import imgSortir from '../assets/presse/sortir.jpg';
import imgOuestFrance from '../assets/presse/ouest-france.jpg';

const VIDEO_ID = 'BGkxX_3Wuic';

const articles = [
  {
    source: "Le Flâneur d'Argoat",
    date: '2024',
    title: 'Le chantournage, art du bois en Centre Bretagne',
    image: imgFlaneur,
    alt: "Article du Flâneur d'Argoat sur le stage de chantournage",
  },
  {
    source: 'Lutun des Bois',
    date: '2024',
    title: 'Annick Le Goasteller, artisane du bois en Bretagne',
    image: imgLutun,
    alt: 'Article Lutun des Bois sur le stage de chantournage',
  },
  {
    source: 'Perspectives',
    date: '2023',
    title: 'Un stage pas comme les autres au cœur de la Bretagne',
    image: imgPerspectives,
    alt: 'Article Perspectives sur le stage de chantournage',
  },
  {
    source: 'Sortir',
    date: '2023',
    title: 'Stage de chantournage — une pratique ancestrale',
    image: imgSortir,
    alt: 'Article Sortir sur le stage de chantournage',
  },
];

export function PressePage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox((l) => ((l ?? 0) - 1 + articles.length) % articles.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox((l) => ((l ?? 0) + 1) % articles.length);
  };

  return (
    <main className={styles.page}>
      <PageSEO
        title="La presse — Stage Bois Bretagne"
        description="Articles et mentions de Stage Bois Bretagne dans les médias locaux et régionaux de Bretagne."
        path="/presse"
      />
      <div className={styles.inner}>
        <p className="section-label">Médias</p>
        <h1 className="section-title">La presse en parle</h1>

        <div className={styles.content}>
          <section className={styles.block}>
            <p>
              Retrouvez ici les articles et reportages consacrés au stage de chantournage
              en Centre Bretagne.
            </p>
          </section>

          <div className={pressStyles.grid}>
            {articles.map((article, i) => (
              <article
                key={i}
                className={`${pressStyles.card} ${pressStyles.cardZoom}`}
                onClick={() => openLightbox(i)}
              >
                <div className={pressStyles.cardImg}>
                  <img src={article.image} alt={article.alt} />
                </div>
                <div className={pressStyles.cardBody}>
                  <div className={pressStyles.cardMeta}>
                    <span className={pressStyles.source}>{article.source}</span>
                    <span className={pressStyles.date}>{article.date}</span>
                  </div>
                  <h2 className={pressStyles.cardTitle}>{article.title}</h2>
                  <span className={pressStyles.cardLink}>Voir l'article →</span>
                </div>
              </article>
            ))}

            <article
              className={`${pressStyles.card} ${pressStyles.cardPointer}`}
              onClick={() =>
                window.open(
                  'https://www.ouest-france.fr/bretagne/landerneau-29800/trois-nouveaux-artisans-au-village-de-meneham-740985',
                  '_blank',
                  'noopener'
                )
              }
            >
              <div className={pressStyles.cardImg}>
                <img src={imgOuestFrance} alt="Article Ouest-France sur le village de Méneham" />
              </div>
              <div className={pressStyles.cardBody}>
                <div className={pressStyles.cardMeta}>
                  <span className={pressStyles.source}>Ouest-France</span>
                </div>
                <h2 className={pressStyles.cardTitle}>
                  Trois nouveaux artisans au village de Méneham
                </h2>
                <span className={pressStyles.cardLink}>Lire l'article →</span>
              </div>
            </article>

            <article
              className={`${pressStyles.card} ${pressStyles.cardPointer}`}
              onClick={() =>
                window.open(`https://youtu.be/${VIDEO_ID}`, '_blank', 'noopener')
              }
            >
              <div className={`${pressStyles.cardImg} ${pressStyles.cardImgVideo}`}>
                <img
                  src={`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`}
                  alt="Reportage vidéo sur le stage de chantournage"
                />
                <div className={pressStyles.playOverlay}>▶</div>
              </div>
              <div className={pressStyles.cardBody}>
                <div className={pressStyles.cardMeta}>
                  <span className={pressStyles.source}>Reportage France 3</span>
                </div>
                <h2 className={pressStyles.cardTitle}>
                  Annick Le Goasteller — chantournage en Centre Bretagne
                </h2>
                <span className={pressStyles.cardLink}>Regarder la vidéo →</span>
              </div>
            </article>
          </div>
        </div>
      </div>

      {lightbox !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={prev}>
            ‹
          </button>
          <img src={articles[lightbox].image} alt={articles[lightbox].alt} />
          <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={next}>
            ›
          </button>
        </div>
      )}
    </main>
  );
}
