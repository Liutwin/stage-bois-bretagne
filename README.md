# Stage Bois Bretagne

Site vitrine pour l'atelier de chantournage d'Annick Le Goasteller, situé à Trébrivan (Côtes d'Armor).

---

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React + Vite |
| Backend | Deno + Oak |
| Base de données | SQLite |
| Génération PDF | jsPDF (côté client) |

---

## Structure du dépôt

```
stage-bois-bretagne/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── StagePage.tsx
│   │   │   ├── InscriptionPage.tsx
│   │   │   ├── TarifsPage.tsx
│   │   │   ├── HebergementPage.tsx
│   │   │   ├── FormatricePage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── PressePage.tsx
│   │   │   ├── AdminPage.tsx
│   │   │   ├── MentionsLegalesPage.tsx
│   │   │   └── PolitiqueConfidentialitePage.tsx
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SessionCard.tsx
│   │   │   └── PageSEO.tsx
│   │   ├── hooks/
│   │   │   └── useSession.ts
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   └── pdf.ts
│   │   ├── types/
│   │   │   └── session.ts
│   │   ├── styles/             # CSS Modules par page/composant
│   │   ├── assets/             # Photos (non versionnées en prod)
│   │   ├── images/             # Images statiques (logo, fond bois…)
│   │   ├── main.tsx            # Point d'entrée site public
│   │   ├── admin-main.tsx      # Point d'entrée interface admin
│   │   └── globals.css
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── index.html
│   ├── admin.html              # Entrée HTML dédiée à l'admin
│   ├── nginx.conf              # Config Nginx interne au conteneur
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── routes/
│   │   ├── session.ts          # CRUD prochain stage
│   │   └── contact.ts          # Envoi email formulaire de contact
│   ├── services/
│   │   ├── session.ts          # Logique métier / accès SQLite
│   │   └── email.ts            # Envoi email via Brevo
│   ├── middleware/
│   │   ├── auth.ts             # Authentification admin
│   │   └── error.ts            # Gestion des erreurs
│   ├── model/
│   │   └── interfaces.ts       # Types partagés
│   ├── config/
│   │   └── db.ts               # Initialisation SQLite
│   ├── main.ts                 # Point d'entrée Deno/Oak
│   ├── deno.json
│   ├── deno.lock
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .vscode/
│   └── extensions.json         # Extensions VSCode recommandées
└── .gitignore
```

---

## Pages du site

| Route | Contenu |
|-------|---------|
| `/` | Accueil, présentation, call-to-action |
| `/stage` | Description du programme |
| `/prochain-stage` | Date, places disponibles, procédure d'inscription |
| `/tarifs` | Grille tarifaire et bulletin d'inscription PDF |
| `/hebergement` | Options d'hébergement à proximité |
| `/formatrice` | Bio d'Annick Le Goasteller |
| `/contact` | Formulaire, coordonnées, carte |
| `/partenaires` | Liens et logos |
| `/admin` | Interface d'administration (protégée) |

---

## Interface d'administration

Hébergée dans le conteneur frontend, accessible via `/admin`.

Formulaire minimaliste avec 3 champs :
- Date du prochain stage
- Nombre de places disponibles
- Thème / description courte

Option pour masquer le stage lorsqu'aucune session n'est programmée.

---

## Développement local

### Prérequis

- Node.js 20 (LTS)
- Deno 2

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Backend

```bash
cd backend
deno run dev
```

> L'extension Deno VSCode est activée uniquement dans `backend/` via `backend/.vscode/settings.json`, pour éviter tout conflit avec TypeScript côté frontend.

---

## Variables d'environnement

Créer un fichier `.env` à la racine du projet (non versionné) :

```
GOOGLE_PLACES_API_KEY=
BREVO_API_KEY=
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=contact@stageboisbretagne.com
MAIL_OWNER=contact@stageboisbretagne.com
```

---

## CI/CD

Le workflow `.github/workflows/deploy.yml` se déclenche sur chaque push sur `main`.

Il construit les images Docker frontend et backend, les pousse sur GitHub Container Registry (`ghcr.io`), puis les déploie sur le VPS.

Les secrets à configurer dans **Settings → Secrets and variables → Actions** :

| Secret | Valeur |
|--------|--------|
| `VPS_HOST` | IP du VPS |
| `VPS_USER` | Utilisateur SSH |
| `VPS_SSH_KEY` | Clé privée SSH dédiée au déploiement |
| `VPS_PORT` | Port SSH |
| `GOOGLE_PLACES_API_KEY` | Clé API Google Places |
| `BREVO_API_KEY` | Clé API Brevo |

---