/**
 * @file pages/AdminPage.tsx
 * @description Interface d'administration minimaliste pour la mise à jour du prochain stage.
 *
 * Cette page est servie sous `/admin` et protégée par HTTP Basic Auth configuré dans Nginx.
 * Elle permet à la propriétaire de mettre à jour les trois champs du prochain stage sans
 * aucune compétence technique.
 *
 * @remarks
 * La protection applicative est assurée côté Nginx — aucun mécanisme d'authentification
 * supplémentaire n'est implémenté dans cette interface.
 */

import { useState, useEffect } from 'react';
import { fetchNextSession, updateSession } from '@/utils/api';
import type { Session, SessionPayload } from '@/types/session';
import styles from '../styles/AdminPage.module.css';

/**
 * Page d'administration du prochain stage.
 *
 * Fonctionnalités :
 * - Chargement des données actuelles au montage
 * - Formulaire de mise à jour : thème, date de début, date de fin, places disponibles, visibilité
 * - Retour visuel en cas de succès ou d'erreur
 *
 * @returns Élément `<main>` de la page d'administration.
 */
export function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [fields, setFields] = useState<SessionPayload>({
    theme: '',
    startDate: '',
    endDate: '',
    spotsAvailable: 0,
    totalSpots: 4,
    isVisible: true,
  });

  // Charge les données actuelles
  useEffect(() => {
    fetchNextSession()
      .then((session: Session | null) => {
        if (session) {
          const { id: _id, ...payload } = session;
          void _id;
          setFields(payload);
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Impossible de charger les données.');
      })
      .finally(() => setLoading(false));
  }, []);

  /** Met à jour un champ du formulaire. */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;
    setFields((prev: SessionPayload) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? Number(value)
          : value,
    }));
  }

  /** Envoie la mise à jour au backend. */
  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      await updateSession(fields);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.skeleton} aria-busy="true" />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* En-tête */}
        <header className={styles.header}>
          <div className={styles.logo}>Stage Bois Bretagne</div>
          <h1>Mise à jour du prochain stage</h1>
          <p>
            Modifiez les informations ci-dessous et cliquez sur
            <strong> Enregistrer</strong>. Les modifications sont visibles
            immédiatement sur le site.
          </p>
        </header>

        {/* Formulaire */}
        <div className={styles.form}>
          {/* Visibilité */}
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              name="isVisible"
              checked={fields.isVisible}
              onChange={handleChange}
            />
            <span>Afficher le stage sur le site public</span>
          </label>

          {fields.isVisible && (
            <>
              {/* Thème */}
              <div className={styles.field}>
                <label htmlFor="theme">Thème / intitulé du stage</label>
                <input
                  id="theme"
                  name="theme"
                  type="text"
                  value={fields.theme}
                  onChange={handleChange}
                  placeholder="Ex : Jouets &amp; Découpes"
                />
              </div>

              {/* Dates */}
              <div className={styles.dateRow}>
                <div className={styles.field}>
                  <label htmlFor="startDate">Date de début</label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={fields.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="endDate">Date de fin</label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={fields.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Places */}
              <div className={styles.dateRow}>
                <div className={styles.field}>
                  <label htmlFor="spotsAvailable">Places disponibles</label>
                  <input
                    id="spotsAvailable"
                    name="spotsAvailable"
                    type="number"
                    min={0}
                    max={fields.totalSpots}
                    value={fields.spotsAvailable}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="totalSpots">Capacité totale</label>
                  <input
                    id="totalSpots"
                    name="totalSpots"
                    type="number"
                    min={1}
                    max={10}
                    value={fields.totalSpots}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          {/* Retours */}
          {error && <p className={styles.errorMsg}>{error}</p>}
          {success && (
            <p className={styles.successMsg}>
              ✓ Modifications enregistrées avec succès.
            </p>
          )}

          {/* Action */}
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </main>
  );
}
