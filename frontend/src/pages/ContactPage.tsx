/**
 * @file pages/ContactPage.tsx
 * @description Page de contact — formulaire simple envoyé au backend Deno.
 */

import { useState } from 'react';
import { sendContactMessage } from '@/utils/api';
import { PageSEO } from '@/components/PageSEO';
import styles from '../styles/ContactPage.module.css';

/**
 * Page de contact publique.
 *
 * Propose un formulaire couvrant nom, email, téléphone et message.
 * L'envoi déclenche une requête `POST /api/contact` vers le backend Deno.
 *
 * @returns Élément `<main>` de la page contact.
 */
export function ContactPage() {
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  /** Met à jour un champ du formulaire. */
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  /** Soumet le formulaire vers l'API de contact. */
  async function handleSubmit() {
    if (!fields.fullName || !fields.email || !fields.message) {
      setErrorMsg('Merci de remplir les champs obligatoires (nom, email, message).');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      await sendContactMessage(fields);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
      setStatus('error');
    }
  }

  return (
    <main className={styles.page}>
      <PageSEO
        title="Contact — Stage Bois Bretagne"
        description="Contactez Annick Le Goasteller pour tout renseignement sur les stages de chantournage à Trébrivan (Côtes-d'Armor)."
        path="/contact"
      />
      <div className={styles.inner}>
        {/* En-tête */}
        <div className={styles.header}>
          <p className="section-label">Nous contacter</p>
          <h1 className="section-title">Contact</h1>
        </div>

        <div className={styles.layout}>
          {/* Formulaire */}
          <section className={styles.formSection}>
            {status === 'success' ? (
              <div className={styles.successBox}>
                <span className={styles.successIcon}>✓</span>
                <h2>Message envoyé !</h2>
                <p>
                  Merci pour votre message. Annick vous répondra dans les
                  meilleurs délais (généralement sous 48 h).
                </p>
              </div>
            ) : (
              <>
                <div className={styles.field}>
                  <label htmlFor="fullName">Nom et prénom *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fields.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={fields.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="phone">Téléphone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={fields.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={fields.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {status === 'error' && (
                  <p className={styles.errorMsg}>{errorMsg}</p>
                )}

                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
                </button>
              </>
            )}
          </section>

          {/* Coordonnées */}
          <aside className={styles.aside}>
            <h2>Coordonnées</h2>
            <ul className={styles.contactList}>
              <li>
                <strong>Annick Le Goasteller</strong><br />
                Artisane et Formatrice
              </li>
              <li>
                3 Kermoal<br />
                22340 Trébrivan
              </li>
              <li>
                <a href="tel:0673823610">06 73 82 36 10</a>
              </li>
              <li>
                <a href="mailto:@stageboisbretagne.com">
                  contact@stageboisbretagne.com
                </a>
              </li>
            </ul>

            {/* Carte Google Maps */}
            <iframe
              className={styles.map}
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d687421.9081784779!2d-3.930337213659672!3d47.6838770776954!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4811a07a4fd00001%3A0xc93d6c31b8b4ba91!2sStage%20Bois%20Bretagne!5e0!3m2!1sfr!2sfr!4v1777579209378!5m2!1sfr!2sfr"
              title="Localisation du stage — 3 Kermoal, Trébrivan"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </aside>
        </div>
      </div>
    </main>
  );
}