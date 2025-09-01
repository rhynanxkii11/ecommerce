import { pgTable, uuid, text, integer, numeric, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { products } from "./products";
import { colors } from "./filters/colors";
import { sizes } from "./filters/sizes";
import { productImages } from "./images";
import { orderItems } from './orders';
import { cartItems } from './carts';

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: text("sku").notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
  colorId: uuid("color_id").references(() => colors.id, { onDelete: 'restrict' }).notNull(),
  sizeId: uuid("size_id").references(() => sizes.id, { onDelete: 'restrict' }).notNull(),
  inStock: integer("in_stock").notNull().default(0),
  weight: real("weight"),
  dimensions: jsonb("dimensions"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
  color: one(colors, { fields: [productVariants.colorId], references: [colors.id] }),
  size: one(sizes, { fields: [productVariants.sizeId], references: [sizes.id] }),
  images: many(productImages),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
}));

export const productVariantSchema = {
  insert: z.object({
    productId: z.string().uuid(),
    sku: z.string().min(1),
    price: z.string(),
    salePrice: z.string().optional().nullable(),
    colorId: z.string().uuid(),
    sizeId: z.string().uuid(),
    inStock: z.number().int().nonnegative().optional(),
    weight: z.number().optional().nullable(),
    dimensions: z
      .object({
        length: z.number(),
        width: z.number(),
        height: z.number(),
      })
      .partial()
      .optional()
      .nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  })
};

export type InsertProductVariant = z.infer<typeof productVariantSchema.insert>;
export type SelectProductVariant = z.infer<typeof productVariantSchema.select>;