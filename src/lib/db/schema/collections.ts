import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { products } from './products';

export const collections = pgTable("collections", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  products: many(productCollections),
}));

export const collectionSchema = {
  insert: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  }),
};

export type InsertCollection = z.infer<typeof collectionSchema.insert>;
export type SelectCollection = z.infer<typeof collectionSchema.select>;

export const productCollections = pgTable("product_collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  collectionId: uuid("collection_id").notNull().references(() => collections.id),
});

export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  product: one(products, { fields: [productCollections.productId], references: [products.id] }),
  collection: one(collections, { fields: [productCollections.collectionId], references: [collections.id] }),
}));

export const productCollectionSchema = {
  insert: z.object({
    productId: z.string().uuid(),
    collectionId: z.string().uuid(),
  }),
  select: z.object({
    id: z.string().uuid(),
  })
};

export type InsertProductCollection = z.infer<typeof productCollectionSchema.insert>;
export type SelectProductCollection = z.infer<typeof productCollectionSchema.select>;