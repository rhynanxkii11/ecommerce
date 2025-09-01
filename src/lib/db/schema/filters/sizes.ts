import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { productVariants } from '../variants'

export const sizes = pgTable("sizes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sizesRelations = relations(sizes, ({ many }) => ({
  variants: many(productVariants),
}));

export const sizeSchema = {
  insert: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    sortOrder: z.number().int(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  }),
};

export type InsertSize = z.infer<typeof sizeSchema.insert>;
export type SelectSize = z.infer<typeof sizeSchema.select>;