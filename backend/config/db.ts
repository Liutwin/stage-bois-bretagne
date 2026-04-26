/**
 * @file config/db.ts
 * @description Initialise la connexion SQLite et crée les tables si elles n'existent pas.
 * Ce module charge les variables d'environnement depuis le fichier `.env` à la racine du projet
 * (`../.env` relativement au dossier `backend/`). En production Docker, les variables sont
 * injectées directement par Docker Compose — le chargement échoue silencieusement si le fichier
 * est absent.
 */

import { load } from "@std/dotenv";
await load({ export: true, envPath: "../.env" }).catch(() => {});
import { Database } from "@db/sqlite";

const DB_PATH = Deno.env.get("DB_PATH") ?? "data/db.sqlite";

await Deno.mkdir("data", { recursive: true }).catch(() => {});

/**
 * Instance SQLite partagée dans toute l'application.
 * Le fichier de base de données est déterminé par la variable d'environnement `DB_PATH`
 * (défaut : `data/db.sqlite`).
 */
export const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    theme           TEXT    NOT NULL,
    start_date      TEXT    NOT NULL,
    end_date        TEXT    NOT NULL,
    spots_available INTEGER NOT NULL DEFAULT 4,
    total_spots     INTEGER NOT NULL DEFAULT 4,
    is_visible      INTEGER NOT NULL DEFAULT 0,
    description     TEXT    NOT NULL DEFAULT ''
  )
`);

// Migration pour les bases existantes (silencieuse si la colonne existe déjà)
try {
  db.exec(`ALTER TABLE sessions ADD COLUMN description TEXT NOT NULL DEFAULT ''`);
} catch (_) { /* colonne déjà présente */ }

console.log(`[DB] SQLite connecté : ${DB_PATH}`);
