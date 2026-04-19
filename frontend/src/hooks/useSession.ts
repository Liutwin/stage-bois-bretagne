/**
 * @file hooks/useSession.ts
 * @description Hook React pour récupérer et rafraîchir les données du prochain stage.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchNextSession } from '@/utils/api';
import type { Session } from '@/types/session';

/**
 * Valeur retournée par le hook {@link useSession}.
 */
export interface UseSessionResult {
  /** Données de la session active, ou `null` si aucun stage n'est programmé. */
  session: Session | null;
  /** Vrai pendant la requête initiale ou un rechargement. */
  loading: boolean;
  /** Message d'erreur si la requête a échoué. */
  error: string | null;
  /** Déclenche manuellement un rechargement des données. */
  refresh: () => void;
}

/**
 * Charge les données du prochain stage depuis l'API et expose un état réactif.
 *
 * Ce hook effectue automatiquement la requête au montage du composant.
 * Utilisez `refresh()` pour forcer un rechargement (après une mise à jour admin, par exemple).
 *
 * @returns {@link UseSessionResult}
 *
 * @example
 * ```tsx
 * function SessionBadge() {
 *   const { session, loading, error } = useSession();
 *   if (loading) return <Spinner />;
 *   if (error) return <p>Erreur : {error}</p>;
 *   if (!session) return <p>Aucun stage programmé pour l'instant.</p>;
 *   return <p>{session.theme} — {session.spotsAvailable} places</p>;
 * }
 * ```
 */
export function useSession(): UseSessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchNextSession()
      .then((data: Session | null) => {
        if (!cancelled) setSession(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return { session, loading, error, refresh };
}
