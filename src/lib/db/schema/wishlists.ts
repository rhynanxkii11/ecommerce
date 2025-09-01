import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./user";
import { products } from "./products";

export const wishlists = pgTable("wishlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  productId: uuid("product_id").notNull().references(() => products.id),
  addedAt: timestamp("added_at").notNull().defaultNow(),
}, (t) => ({
  uniq: uniqueIndex('wishlists_user_product_uniq').on(t.userId, t.productId),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, { fields: [wishlists.userId], references: [users.id] }),
  product: one(products, { fields: [wishlists.productId], references: [products.id] }),
}));

export const wishlistSchema = {
  insert: z.object({
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    addedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  })
};

export type InsertWishlist = z.infer<typeof wishlistSchema.insert>;
export type SelectWishlist = z.infer<typeof wishlistSchema.select>;