import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { products } from "./products";

export const brands = pgTable("brands", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logoUrl: text("logo_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const brandSchema = {
  insert: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    logoUrl: z.string().optional().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  }),
};

export type InsertBrand = z.infer<typeof brandSchema.insert>;
export type SelectBrand = z.infer<typeof brandSchema.select>;