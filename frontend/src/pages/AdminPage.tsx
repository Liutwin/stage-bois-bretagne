import { useState, useEffect } from 'react';
import {
  fetchAllAdminSessions, updateSession, verifyAdminPassword,
  getAdminToken, setAdminToken, clearAdminToken,
  fetchTestimonials, updateTestimonial,
} from '@/utils/api';
import type { SessionPayload, StageType, Testimonial } from '@/types/session';
import { STAGE_LABELS } from '@/types/session';
import styles from '../styles/AdminPage.module.css';

const STAGE_TYPES: StageType[] = ['initiation', 'jouets', 'perfectionnement'];

function defaultPayload(type: StageType): SessionPayload {
  return { type, startDate: '', endDate: '', spotsAvailable: 3, totalSpots: 3, isVisible: false, description: '' };
}

// ── Écran de connexion ────────────────────────────────────────────────────────

interface LoginScreenProps {
  onLogin: () => void;
}

function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

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

// ── Carte par type de stage ───────────────────────────────────────────────────

interface StageTypeCardProps {
  type: StageType;
  initial: SessionPayload;
  onUnauthorized: () => void;
}

const TODAY = new Date().toISOString().split('T')[0];

function StageTypeCard({ type, initial, onUnauthorized }: StageTypeCardProps) {
  const [fields, setFields] = useState<SessionPayload>(initial);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type: inputType } = e.target;
    setFields(prev => ({
      ...prev,
      [name]: inputType === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : inputType === 'number' ? Number(value)
        : value,
    }));
  }

  const startInPast =
    !!fields.startDate && fields.startDate < TODAY;
  const endBeforeStart =
    !!fields.startDate && !!fields.endDate && fields.endDate < fields.startDate;
  const spotsExceedCapacity = fields.spotsAvailable > fields.totalSpots;
  const hasValidationErrors = startInPast || endBeforeStart || spotsExceedCapacity;

  async function saveWith(payload: SessionPayload) {
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      await updateSession(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.';
      if (msg.includes('401') || msg.toLowerCase().includes('autorisé')) {
        onUnauthorized();
        return;
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleVisibilityToggle(checked: boolean) {
    const updated = { ...fields, isVisible: checked };
    setFields(updated);
    await saveWith(updated);
  }

  return (
    <div className={styles.stageCard}>
      <div className={styles.stageCardHeader}>
        <h2 className={styles.stageCardTitle}>{STAGE_LABELS[type]}</h2>
        <span className={`${styles.statusBadge} ${fields.isVisible ? styles.statusVisible : styles.statusHidden}`}>
          {fields.isVisible ? 'Visible' : 'Masqué'}
        </span>
      </div>

      <div className={styles.stageForm}>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            name="isVisible"
            checked={fields.isVisible}
            onChange={e => handleVisibilityToggle(e.target.checked)}
          />
          <span>Afficher sur le site public</span>
        </label>

        <div className={styles.dateRow}>
          <div className={styles.field}>
            <label>Date de début</label>
            <input
              name="startDate"
              type="date"
              value={fields.startDate}
              min={TODAY}
              onChange={handleChange}
              className={startInPast || endBeforeStart ? styles.inputInvalid : undefined}
            />
            {startInPast && (
              <span className={styles.fieldError}>
                La date de début ne peut pas être dans le passé.
              </span>
            )}
          </div>
          <div className={styles.field}>
            <label>Date de fin</label>
            <input
              name="endDate"
              type="date"
              value={fields.endDate}
              min={fields.startDate || undefined}
              onChange={handleChange}
              className={endBeforeStart ? styles.inputInvalid : undefined}
            />
            {endBeforeStart && (
              <span className={styles.fieldError}>
                La date de fin ne peut pas être antérieure à la date de début.
              </span>
            )}
          </div>
        </div>

        <div className={styles.dateRow}>
          <div className={styles.field}>
            <label>Places disponibles</label>
            <input
              name="spotsAvailable"
              type="number"
              min={0}
              max={fields.totalSpots}
              value={fields.spotsAvailable}
              onChange={handleChange}
              className={spotsExceedCapacity ? styles.inputInvalid : undefined}
            />
            {spotsExceedCapacity && (
              <span className={styles.fieldError}>
                Ne peut pas dépasser la capacité totale ({fields.totalSpots}).
              </span>
            )}
          </div>
          <div className={styles.field}>
            <label>Capacité totale</label>
            <input
              name="totalSpots"
              type="number"
              min={1}
              max={10}
              value={fields.totalSpots}
              onChange={handleChange}
              className={spotsExceedCapacity ? styles.inputInvalid : undefined}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>Commentaires</label>
          <textarea
            name="description"
            rows={2}
            maxLength={300}
            value={fields.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Ex : Prochaines dates envisagées courant automne 2025…"
          />
          <span className={styles.charCount}>{fields.description.length} / 300</span>
        </div>

        {error   && <p className={styles.errorMsg}>{error}</p>}
        {success && <p className={styles.successMsg}>✓ Modifications enregistrées.</p>}

        <button className={styles.saveBtn} onClick={() => saveWith(fields)} disabled={saving || hasValidationErrors}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

// ── Carte témoignage ──────────────────────────────────────────────────────────

interface TestimonialCardProps {
  initial: Testimonial;
  onUnauthorized: () => void;
}

function TestimonialCard({ initial, onUnauthorized }: TestimonialCardProps) {
  const [fields, setFields] = useState<Testimonial>(initial);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setFields(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number' ? Number(value)
        : value,
    }));
  }

  async function saveWith(payload: Testimonial) {
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      await updateTestimonial(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.';
      if (msg.includes('401') || msg.toLowerCase().includes('autorisé')) {
        onUnauthorized();
        return;
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleVisibilityToggle(checked: boolean) {
    const updated = { ...fields, isVisible: checked };
    setFields(updated);
    await saveWith(updated);
  }

  return (
    <div className={styles.stageCard}>
      <div className={styles.stageCardHeader}>
        <h2 className={styles.stageCardTitle}>Témoignage {fields.slot}</h2>
        <span className={`${styles.statusBadge} ${fields.isVisible ? styles.statusVisible : styles.statusHidden}`}>
          {fields.isVisible ? 'Visible' : 'Masqué'}
        </span>
      </div>

      <div className={styles.stageForm}>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            name="isVisible"
            checked={fields.isVisible}
            onChange={e => handleVisibilityToggle(e.target.checked)}
          />
          <span>Afficher sur le site public</span>
        </label>

        <div className={styles.field}>
          <label>Texte de l'avis</label>
          <textarea
            name="text"
            rows={3}
            maxLength={400}
            value={fields.text}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Saisissez le témoignage ici…"
          />
          <span className={styles.charCount}>{fields.text.length} / 400</span>
        </div>

        <div className={styles.dateRow}>
          <div className={styles.field}>
            <label>Auteur</label>
            <input name="author" type="text" value={fields.author} onChange={handleChange} placeholder="Marie L." />
          </div>
          <div className={styles.field}>
            <label>Date (texte libre)</label>
            <input name="dateLabel" type="text" value={fields.dateLabel} onChange={handleChange} placeholder="mai 2026" />
          </div>
        </div>

        <div className={styles.field}>
          <label>Note</label>
          <select
            name="rating"
            value={fields.rating}
            onChange={e => setFields(prev => ({ ...prev, rating: Number(e.target.value) }))}
            className={styles.textarea}
            style={{ minHeight: 'unset', resize: 'none', padding: '9px 12px' }}
          >
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{'★'.repeat(n)} ({n}/5)</option>
            ))}
          </select>
        </div>

        {error   && <p className={styles.errorMsg}>{error}</p>}
        {success && <p className={styles.successMsg}>✓ Témoignage enregistré.</p>}

        <button className={styles.saveBtn} onClick={() => saveWith(fields)} disabled={saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean>(() => !!getAdminToken());
  const [loading, setLoading]   = useState(true);
  const [loadError, setLoadError] = useState('');

  const [sessions, setSessions] = useState<Record<StageType, SessionPayload>>({
    initiation:       defaultPayload('initiation'),
    jouets:           defaultPayload('jouets'),
    perfectionnement: defaultPayload('perfectionnement'),
  });

  const defaultTestimonial = (slot: number): Testimonial =>
    ({ slot, text: '', author: '', dateLabel: '', rating: 5, isVisible: false });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([1, 2, 3].map(defaultTestimonial));
  const [activeTab, setActiveTab] = useState<'stages' | 'avis'>('stages');

  useEffect(() => {
    if (!authenticated) { setLoading(false); return; }
    Promise.all([
      fetchAllAdminSessions(),
      fetchTestimonials(),
    ])
      .then(([sessionData, testimonialData]) => {
        setSessions(prev => {
          const next = { ...prev };
          for (const s of sessionData) {
            const { id: _id, theme: _theme, ...payload } = s;
            void _id; void _theme;
            next[s.type] = payload;
          }
          return next;
        });
        if (testimonialData.length > 0) setTestimonials(testimonialData);
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : 'Impossible de charger les données.');
      })
      .finally(() => setLoading(false));
  }, [authenticated]);

  function handleLogout() {
    clearAdminToken();
    setAuthenticated(false);
  }

  function handleUnauthorized() {
    clearAdminToken();
    setAuthenticated(false);
  }

  if (!authenticated) {
    return (
      <LoginScreen onLogin={() => { setAuthenticated(true); setLoading(true); }} />
    );
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
      <div className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <div>
              <div className={styles.logo}>Stage Bois Bretagne</div>
              <h1>Administration</h1>
            </div>
            <div className={styles.headerActions}>
              <a href="/" target="_blank" rel="noopener noreferrer" className={styles.siteLink}>
                Voir le site →
              </a>
              <button className={styles.logoutBtn} onClick={handleLogout} type="button">
                Se déconnecter
              </button>
            </div>
          </div>
        </header>

        <nav className={styles.tabs} aria-label="Sections de l'administration">
          <button
            className={`${styles.tab} ${activeTab === 'stages' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('stages')}
            type="button"
          >
            Stages
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'avis' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('avis')}
            type="button"
          >
            Témoignages
          </button>
        </nav>

        {loadError && (
          <div className={styles.loadErrorBanner}>
            <p className={styles.errorMsg}>{loadError}</p>
          </div>
        )}

        {activeTab === 'stages' && (
          <div className={styles.cardsGrid}>
            {STAGE_TYPES.map(type => (
              <StageTypeCard
                key={type}
                type={type}
                initial={sessions[type]}
                onUnauthorized={handleUnauthorized}
              />
            ))}
          </div>
        )}

        {activeTab === 'avis' && (
          <div className={styles.cardsGrid}>
            {testimonials.map(t => (
              <TestimonialCard
                key={t.slot}
                initial={t}
                onUnauthorized={handleUnauthorized}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
