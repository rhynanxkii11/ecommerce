import { pgTable, uuid, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    parentId: uuid("parent_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    parentFk: foreignKey({
    columns: [t.parentId],
    foreignColumns: [t.id],
  }).onDelete('set null'),
  })
);

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  children: many(categories),
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
}));

export const categorySchema = {
  insert: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    parentId: z.string().uuid().optional().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  }),
};

export type InsertCategory = z.infer<typeof categorySchema.insert>;
export type SelectCategory = z.infer<typeof categorySchema.select>;