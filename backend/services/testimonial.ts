import { db } from "../config/db.ts";
import type { Testimonial, TestimonialRow } from "../model/interfaces.ts";

function toTestimonial(row: TestimonialRow): Testimonial {
  return {
    slot:      row.slot,
    text:      row.text,
    author:    row.author,
    dateLabel: row.date_label,
    rating:    row.rating,
    isVisible: row.is_visible === 1,
  };
}

export function getAllTestimonials(): Testimonial[] {
  const rows = db
    .prepare("SELECT * FROM testimonials ORDER BY slot ASC")
    .all() as TestimonialRow[];
  return rows.map(toTestimonial);
}

export function upsertTestimonial(t: Testimonial): Testimonial {
  db.prepare(
    `UPDATE testimonials SET text=?, author=?, date_label=?, rating=?, is_visible=? WHERE slot=?`,
  ).run(t.text, t.author, t.dateLabel, t.rating, t.isVisible ? 1 : 0, t.slot);
  return t;
}
