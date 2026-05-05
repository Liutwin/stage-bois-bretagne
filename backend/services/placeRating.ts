import type { PlaceRating } from "../model/interfaces.ts";

const TTL_MS = 6 * 60 * 60 * 1000; // 6 heures

let cache: PlaceRating | null = null;
let cacheExpiry = 0;

export async function getPlaceRating(): Promise<PlaceRating | null> {
  const PLACE_ID  = Deno.env.get("PLACE_ID")  ?? "";
  const PLACE_API = Deno.env.get("PLACE_API") ?? "";

  if (!PLACE_ID || !PLACE_API) {
    console.warn("[PlaceRating] PLACE_ID ou PLACE_API manquant dans .env");
    return null;
  }
  if (cache && Date.now() < cacheExpiry) return cache;

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key":   PLACE_API,
        "X-Goog-FieldMask": "rating,userRatingCount",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[PlaceRating] Erreur API ${res.status} : ${body}`);
      return null;
    }

    const data = await res.json();

    if (typeof data.rating !== "number") {
      console.warn(`[PlaceRating] Champ 'rating' absent dans la réponse`);
      return null;
    }

    cache = { rating: data.rating, userRatingsTotal: data.userRatingCount ?? 0 };
    cacheExpiry = Date.now() + TTL_MS;
    return cache;
  } catch (err) {
    console.error("[PlaceRating] Erreur réseau :", err);
    return null;
  }
}
