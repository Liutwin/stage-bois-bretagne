/**
 * @file main.ts
 * @description Point d'entrée du backend Stage Bois Bretagne.
 *
 * Démarre un serveur Oak sur `HOST:PORT` avec les middlewares et routes suivants :
 * - {@link errorMiddleware} — gestion globale des erreurs
 * - {@link sessionRouter}  — `GET /api/session`, `PUT /api/admin/session`
 * - {@link contactRouter}  — `POST /api/contact`
 *
 * Le guard `import.meta.main` permet d'importer ce module dans les tests
 * sans démarrer le serveur.
 */

import { load } from "jsr:@std/dotenv";
import { Application } from "@oak/oak";
import "./config/db.ts";
import { errorMiddleware } from "./middleware/error.ts";
import sessionRouter from "./routes/session.ts";
import contactRouter from "./routes/contact.ts";
import inscriptionRouter from "./routes/inscription.ts";

await load({ export: true });

const PORT = parseInt(Deno.env.get("PORT") ?? "8000");
const HOSTNAME = Deno.env.get("HOST") ?? "0.0.0.0";

/** Instance Oak exportée pour les tests d'intégration. */
export const app = new Application();

app.use(errorMiddleware);

app.use(sessionRouter.routes(), sessionRouter.allowedMethods());
app.use(contactRouter.routes(), contactRouter.allowedMethods());
app.use(inscriptionRouter.routes(), inscriptionRouter.allowedMethods());

app.addEventListener("listen", () =>
  console.log(`[API] Backend démarré sur http://${HOSTNAME}:${PORT}`)
);

if (import.meta.main) {
  await app.listen({ hostname: HOSTNAME, port: PORT });
}
