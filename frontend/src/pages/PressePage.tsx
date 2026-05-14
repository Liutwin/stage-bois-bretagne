import { useState } from 'react';
import styles from '../styles/StaticPage.module.css';
import pressStyles from '../styles/PressePage.module.css';
import { PageSEO } from '@/components/PageSEO';

import imgFlaneur from '../assets/presse/flaneur-argoat.jpg';
import imgOuestFrance2004 from '../assets/presse/ouest-france-2004.jpg';
import imgCotesArmorMagazine from '../assets/presse/cotes-armor-magazine.jpg';
import imgSortir from '../assets/presse/sortir.jpg';
import imgOuestFrance2013 from '../assets/presse/ouest-france-2013.jpg';
import imgPoher from '../assets/presse/lepoher.jpg';

const VIDEO_ID = 'BGkxX_3Wuic';

const articles = [
  {
    source: "Le Flâneur d'Argoat",
    date: '2009',
    title: 'Les jouets en bois, indémodables et simplement beaux',
    image: imgFlaneur,
    alt: "Article du Flâneur d'Argoat",
  },
  {
    source: 'Ouest-France',
    date: '2004',
    title: 'Le lutin des bois vous souhaite la bienvenue',
    image: imgOuestFrance2004,
    alt: 'Article Ouest France',
  },
  {
    source: 'Le Poher',
    date: '2004',
    title: 'Quand le bois devient art',
    image: imgPoher,
    alt: 'Article Le Poher',
  },
  {
    source: 'Côtes d\'Armor Magazine',
    date: '2000',
    title: 'La passion du bois',
    image: imgCotesArmorMagazine,
    alt: 'Article Côtes d\'Armor Magazine',
  },
  {
    source: 'Sortir',
    date: '2001',
    title: 'Le paradis en bois d\'Annick',
    image: imgSortir,
    alt: 'Article Sortir',
  },
  {
    source: 'France 3 Iroise',
    date: '2004',
    title: 'Tout en bois',
    video: VIDEO_ID,
    alt: 'Reportage vidéo de France 3 Iroise',
  },
];

const sortedArticles = [...articles].sort((a, b) => {
  const dateA = parseInt(a.date || '0', 10);
  const dateB = parseInt(b.date || '0', 10);
  return dateB - dateA;
});

export function PressePage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox((l) => ((l ?? 0) - 1 + sortedArticles.length) % sortedArticles.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox((l) => ((l ?? 0) + 1) % sortedArticles.length);
  };

  return (
    <main className={styles.page}>
      <PageSEO
        title="La presse — Stage Bois Bretagne"
        description="Articles dans les médias locaux et régionaux de Bretagne."
        path="/presse"
      />
      <div className={styles.inner}>
        <p className="section-label">Médias</p>
        <h1 className="section-title">La presse en parle</h1>

        <div className={styles.content}>
          <section className={styles.block}>
            <p>
              Retrouvez ici les articles et reportages consacrés à l'activité d'Annick Le Goasteller.
            </p>
          </section>

          <div className={pressStyles.grid}>
            

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
                <img src={imgOuestFrance2013} alt="Article Ouest-France sur le village de Méneham" />
              </div>
              <div className={pressStyles.cardBody}>
                <div className={pressStyles.cardMeta}>
                  <span className={pressStyles.source}>Ouest-France</span>
                  <span className={pressStyles.date}>2013</span>
                </div>
                <h2 className={pressStyles.cardTitle}>
                  Trois nouveaux artisans au village de Méneham
                </h2>
                <span className={pressStyles.cardLink}>Lire l'article →</span>
              </div>
            </article>

            {sortedArticles.map((article, i) => (
              <article
                key={i}
                className={`${pressStyles.card} ${'video' in article ? pressStyles.cardPointer : pressStyles.cardZoom}`}
                onClick={() => openLightbox(i)}
              >
                <div className={`${pressStyles.cardImg}${'video' in article ? ` ${pressStyles.cardImgVideo}` : ''}`}>
                  {!('video' in article) ? (
                    <img src={article.image} alt={article.alt} />
                  ) : (
                    <>
                      <img
                        src={`https://img.youtube.com/vi/${article.video}/hqdefault.jpg`}
                        alt={article.alt}
                      />
                      <div className={pressStyles.playOverlay}>▶</div>
                    </>
                  )}
                </div>
                <div className={pressStyles.cardBody}>
                  <div className={pressStyles.cardMeta}>
                    {article.source && <span className={pressStyles.source}>{article.source}</span>}
                    {article.date && <span className={pressStyles.date}>{article.date}</span>}
                  </div>
                  <h2 className={pressStyles.cardTitle}>{article.title}</h2>
                  <span className={pressStyles.cardLink}>
                    {'video' in article ? 'Regarder la vidéo →' : 'Voir l\'article →'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {lightbox !== null && (
        <div
          className={styles.lightbox}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={prev}>
            ‹
          </button>
          {'video' in sortedArticles[lightbox] ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${sortedArticles[lightbox].video}`}
              title={sortedArticles[lightbox].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img src={sortedArticles[lightbox].image} alt={sortedArticles[lightbox].alt} />
          )}
          <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={next}>
            ›
          </button>
        </div>
      )}
    </main>
  );
}
