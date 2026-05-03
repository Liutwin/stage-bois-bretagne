/**
 * @file pages/AdminPage.tsx
 * @description Page d'administration protégée par mot de passe.
 * Permet de consulter et mettre à jour les informations du prochain stage.
 */

import { useState, useEffect } from 'react';
import { fetchNextSession, updateSession, verifyAdminPassword, getAdminToken, setAdminToken, clearAdminToken } from '@/utils/api';
import type { Session, SessionPayload } from '@/types/session';
import styles from '../styles/AdminPage.module.css';

/**
 * Props du composant {@link LoginScreen}.
 */
interface LoginScreenProps {
  /** Callback appelé après une authentification réussie. */
  onLogin: () => void;
}

/**
 * Écran de connexion affiché avant d'accéder au panneau d'administration.
 * Vérifie le mot de passe via l'API et stocke le token en session si valide.
 *
 * @param props - {@link LoginScreenProps}
 * @returns Formulaire de connexion centré.
 */
function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Soumet le formulaire de connexion et tente de vérifier le mot de passe.
   * En cas de succès, stocke le token et appelle {@link LoginScreenProps.onLogin}.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyAdminPassword(password);
      setAdminToken(password);
      onLogin();
    } catch {
      setError('Mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.logo}>Stage Bois Bretagne</div>
          <h1>Accès administration</h1>
          <p>Entrez le mot de passe pour accéder à l'interface.</p>
        </header>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className={styles.errorMsg}>{error}</p>}
          <button className={styles.saveBtn} type="submit" disabled={loading || !password}>
            {loading ? 'Vérification…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </main>
  );
}

/**
 * Page d'administration du stage.
 *
 * Affiche d'abord {@link LoginScreen} si aucun token n'est présent.
 * Une fois authentifié, charge la session actuelle et permet de la modifier
 * (thème, dates, places, visibilité) puis de l'enregistrer via l'API.
 *
 * @returns Panneau d'administration ou écran de connexion.
 */
export function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean>(
    () => !!getAdminToken(),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [fields, setFields] = useState<SessionPayload>({
    theme: '',
    startDate: '',
    endDate: '',
    spotsAvailable: 3,
    totalSpots: 3,
    isVisible: true,
    description: '',
  });

  useEffect(() => {
    if (!authenticated) {
      setLoading(false);
      return;
    }
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
  }, [authenticated]);

  /** Met à jour le champ correspondant dans `fields` selon le type de l'input (checkbox, number, text). */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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

  /** Efface le token d'administration et revient à l'écran de connexion. */
  function handleLogout() {
    clearAdminToken();
    setAuthenticated(false);
  }

  /**
   * Envoie les champs modifiés à l'API via {@link updateSession}.
   * Déconnecte automatiquement l'utilisateur en cas de réponse 401.
   */
  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      await updateSession(fields);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.';
      if (msg.includes('401') || msg.toLowerCase().includes('autorisé')) {
        clearAdminToken();
        setAuthenticated(false);
        return;
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => { setAuthenticated(true); setLoading(true); }} />;
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
        <header className={styles.header}>
          <div className={styles.logo}>Stage Bois Bretagne</div>
          <h1>Mise à jour du prochain stage</h1>
          <p>
            Modifiez les informations ci-dessous et cliquez sur <strong> Enregistrer</strong>.<br />
            Les modifications sont visibles immédiatement sur le site.
          </p>
        </header>

        <div className={styles.form}>
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

              <div className={styles.field}>
                <label htmlFor="description">Prochaines dates potentielles</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  maxLength={300}
                  value={fields.description}
                  onChange={handleChange}
                  placeholder="Ex : D'autres dates sont envisagées courant automne 2025, en cours de planification…"
                  className={styles.textarea}
                />
                <span className={styles.charCount}>{fields.description.length} / 300</span>
              </div>
            </>
          )}

          {error && <p className={styles.errorMsg}>{error}</p>}
          {success && (
            <p className={styles.successMsg}>
              ✓ Modifications enregistrées avec succès.
            </p>
          )}

          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>

          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            type="button"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </main>
  );
}
