import { Router } from "@oak/oak";
import { getAllTestimonials, upsertTestimonial } from "../services/testimonial.ts";
import { getPlaceRating } from "../services/placeRating.ts";
import { adminAuthMiddleware } from "../middleware/auth.ts";
import type { Testimonial } from "../model/interfaces.ts";

const router = new Router({ prefix: "/api" });

/** `GET /api/testimonials` — les 3 témoignages pour le site public. */
router.get("/testimonials", (ctx) => {
  ctx.response.body = { ok: true, data: getAllTestimonials() };
});

/** `GET /api/place-rating` — note globale Google Places (mise en cache 6h). */
router.get("/place-rating", async (ctx) => {
  const PLACE_ID = Deno.env.get("PLACE_ID") ?? "";
  const reviewUrl = PLACE_ID
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(PLACE_ID)}`
    : null;
  const data = await getPlaceRating();
  ctx.response.body = { ok: true, data, reviewUrl };
});

/** `PUT /api/admin/testimonial` — met à jour un témoignage (slot 1, 2 ou 3). */
router.put("/admin/testimonial", adminAuthMiddleware, async (ctx) => {
  let body: Record<string, unknown>;
  try {
    body = await ctx.request.body.json();
  } catch {
    ctx.response.status = 400;
    ctx.response.body = { ok: false, error: "Corps de requête JSON invalide." };
    return;
  }

  const { slot, text, author, dateLabel, rating, isVisible } = body as Partial<Testimonial>;

  if (
    typeof slot      !== "number"  || slot < 1 || slot > 3 ||
    typeof text      !== "string"  ||
    typeof author    !== "string"  ||
    typeof dateLabel !== "string"  ||
    typeof rating    !== "number"  || rating < 1 || rating > 5 ||
    typeof isVisible !== "boolean"
  ) {
    ctx.response.status = 400;
    ctx.response.body = { ok: false, error: "Champs manquants ou invalides." };
    return;
  }

  const t = upsertTestimonial({ slot, text, author, dateLabel, rating, isVisible });
  ctx.response.body = { ok: true, data: t };
});

export default router;
