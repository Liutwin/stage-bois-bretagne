import styles from '../styles/StaticPage.module.css';

export function MentionsLegalesPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className="section-label">Informations légales</p>
        <h1 className="section-title">Mentions légales</h1>

        <div className={styles.content}>
          <section className={styles.block}>
            <h2>Éditeur du site</h2>
            <p>
              Le présent site est édité par :<br />
              <strong>Annick Le Goasteller</strong><br />
              Artisane formatrice — activité exercée à titre individuel<br />
              3 Kermoal — 22340 Trébrivan<br />
              Téléphone : <a href="tel:0296297197">02 96 29 71 97</a><br />
              E-mail : <a href="mailto:contact@stageboisbretagne.com">contact@stageboisbretagne.com</a>
            </p>
          </section>

          <section className={styles.block}>
            <h2>Directrice de la publication</h2>
            <p>Annick Le Goasteller</p>
          </section>

          <section className={styles.block}>
            <h2>Conception et développement</h2>
            <p>Liutwin Piernet</p>
          </section>

          <section className={styles.block}>
            <h2>Hébergeur</h2>
            <p>
              Ce site est hébergé par :<br />
              <strong>OVHcloud</strong><br />
              2 rue Kellermann — 59100 Roubaix<br />
              <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">
                www.ovhcloud.com
              </a>
            </p>
          </section>

          <section className={styles.block}>
            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur ce site (textes, photographies, illustrations,
              créations graphiques) est la propriété exclusive d'Annick Le Goasteller ou de ses
              ayants droit. Toute reproduction, représentation ou diffusion, même partielle,
              sur quelque support que ce soit, sans autorisation préalable et écrite est strictement
              interdite et constituerait une contrefaçon au sens des articles L. 335-2 et suivants
              du Code de la propriété intellectuelle.
            </p>
          </section>

          <section className={styles.block}>
            <h2>Responsabilité</h2>
            <p>
              Les informations contenues sur ce site sont fournies à titre indicatif et peuvent
              être modifiées à tout moment. L'éditeur ne saurait être tenu responsable des erreurs,
              omissions ou des résultats obtenus par l'utilisation de ces informations.
            </p>
            <p>
              Des liens hypertextes peuvent renvoyer vers des sites tiers. L'éditeur n'exerce aucun
              contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
          </section>

          <section className={styles.block}>
            <h2>Droit applicable</h2>
            <p>
              Le présent site est soumis au droit français. Tout litige relatif à son utilisation
              relève de la compétence exclusive des tribunaux français.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
