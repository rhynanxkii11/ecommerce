import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { productVariants } from '../variants';

export const colors = pgTable("colors", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    hexCode: text("hex_code").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const colorsRelations = relations(colors, ({ many }) => ({
  variants: many(productVariants),
}));

export const colorSchema = {
  insert: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    hexCode: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  }),
};

export type InsertColor = z.infer<typeof colorSchema.insert>;
export type SelectColor = z.infer<typeof colorSchema.select>;