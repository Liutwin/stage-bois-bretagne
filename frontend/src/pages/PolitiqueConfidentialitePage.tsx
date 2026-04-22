import styles from '../styles/StaticPage.module.css';

export function PolitiqueConfidentialitePage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className="section-label">Données personnelles</p>
        <h1 className="section-title">Politique de confidentialité</h1>

        <div className={styles.content}>
          <section className={styles.block}>
            <h2>Responsable du traitement</h2>
            <p>
              Annick Le Goasteller — 3 Kermoal, 22340 Trébrivan<br />
              E-mail : <a href="mailto:contact@stageboisbretagne.com">contact@stageboisbretagne.com</a>
            </p>
          </section>

          <section className={styles.block}>
            <h2>Données collectées</h2>
            <p>
              Dans le cadre de l'utilisation du formulaire de contact, les données suivantes
              peuvent être collectées :
            </p>
            <ul className={styles.list}>
              <li>Nom et prénom</li>
              <li>Adresse e-mail</li>
              <li>Numéro de téléphone (facultatif)</li>
              <li>Message libre</li>
            </ul>
            <p>
              Aucune donnée sensible (origine ethnique, opinions politiques, données de santé, etc.)
              n'est collectée.
            </p>
          </section>

          <section className={styles.block}>
            <h2>Finalité du traitement</h2>
            <p>
              Les données sont collectées exclusivement pour répondre à vos demandes d'information
              ou d'inscription aux stages. Elles ne font l'objet d'aucune cession à des tiers ni
              d'aucun usage commercial.
            </p>
          </section>

          <section className={styles.block}>
            <h2>Base légale</h2>
            <p>
              Le traitement est fondé sur votre consentement (article 6.1.a du RGPD), exprimé
              lors de l'envoi du formulaire de contact.
            </p>
          </section>

          <section className={styles.block}>
            <h2>Durée de conservation</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire au traitement de votre
              demande, et au maximum 3 ans à compter du dernier contact.
            </p>
          </section>

          <section className={styles.block}>
            <h2>Vos droits</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
              Informatique et Libertés, vous disposez des droits suivants :
            </p>
            <ul className={styles.list}>
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification en cas d'inexactitude</li>
              <li>Droit à l'effacement (« droit à l'oubli »)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit d'opposition au traitement</li>
              <li>Droit à la portabilité de vos données</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à l'adresse :{' '}
              <a href="mailto:contact@stageboisbretagne.com">contact@stageboisbretagne.com</a>.
              Vous disposez également du droit d'introduire une réclamation auprès de la{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
            </p>
          </section>

          <section className={styles.block}>
            <h2>Cookies</h2>
            <p>
              Ce site n'utilise pas de cookies à des fins de suivi ou de publicité ciblée.
              Des cookies techniques strictement nécessaires au bon fonctionnement du site
              peuvent être déposés ; ils ne requièrent pas votre consentement.
            </p>
          </section>

          <section className={styles.block}>
            <h2>Sécurité</h2>
            <p>
              Des mesures techniques et organisationnelles appropriées sont mises en œuvre pour
              protéger vos données contre tout accès non autorisé, perte ou divulgation.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
