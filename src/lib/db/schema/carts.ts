import { pgTable, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./user";
import { guests } from "./guest";
import { productVariants } from "./variants";

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  guestId: uuid("guest_id").references(() => guests.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartsRelations = relations(carts, ({ many, one }) => ({
  items: many(cartItems),
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  guest: one(guests, {fields: [carts.guestId], references: [guests.id],
  }),
}));

export const cartSchema = {
  insert: z.object({
    userId: z.string().uuid().optional().nullable(),
    guestId: z.string().uuid().optional().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  })
};

export type InsertCart = z.infer<typeof cartSchema.insert>;
export type SelectCart = z.infer<typeof cartSchema.select>;

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartId: uuid("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productVariantId: uuid("product_variant_id").notNull().references(() => productVariants.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull().default(1)
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  variant: one(productVariants, { fields: [cartItems.productVariantId], references: [productVariants.id] }),
}));

export const cartItemSchema = {
  insert: z.object({
    cartId: z.string().uuid(),
    productVariantId: z.string().uuid(),
    quantity: z.number().int().min(1),
  }),
  select: z.object({
    id: z.string().uuid(),
  })
};

export type InsertCartItem = z.infer<typeof cartItemSchema.insert>;
export type SelectCartItem = z.infer<typeof cartItemSchema.select>;