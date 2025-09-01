import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { products } from '../products';

export const genders = pgTable("genders", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));

export const genderSchema = {
  insert: z.object({
    label: z.string().min(1),
    slug: z.string().min(1),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  }),
};

export type InsertGender = z.infer<typeof genderSchema.insert>;
export type SelectGender = z.infer<typeof genderSchema.select>;