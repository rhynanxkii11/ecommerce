import { pgTable, uuid, text, integer, timestamp, } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { products } from "./products";
import { users } from "./user";

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
  ratingRange: sql`CHECK (${t.rating.name} BETWEEN 1 AND 5)`,
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const reviewSchema = {
  insert: z.object({
    productId: z.string().uuid(),
    userId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional().nullable(),
  }),
  select: z.object({
    id: z.string().uuid(),
  }),
};

export type InsertReview = z.infer<typeof reviewSchema.insert>;
export type SelectReview = z.infer<typeof reviewSchema.select>;