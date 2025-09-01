import { pgTable, uuid, integer, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./user";
import { addresses } from "./addresses";
import { productVariants } from "./variants";

export const orderStatus = pgEnum("order_status", ["pending", "paid", "shipped", "delivered", "cancelled"]);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "set null" }),
  status: orderStatus("status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  shippingAddressId: uuid("shipping_address_id").references(() => addresses.id, { onDelete: "set null" }),
  billingAddressId: uuid("billing_address_id").references(() => addresses.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
  }),
}));

export const orderSchema = {
  insert: z.object({
    userId: z.string().uuid().optional().nullable(),
    status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]).optional(),
    totalAmount: z.number(),
    shippingAddressId: z.string().uuid().optional().nullable(),
    billingAddressId: z.string().uuid().optional().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  })
};

export type InsertOrder = z.infer<typeof orderSchema.insert>;
export type SelectOrder = z.infer<typeof orderSchema.select>;

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productVariantId: uuid("product_variant_id").notNull().references(() => productVariants.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull().default(1),
  priceAtPurchase: numeric("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  variant: one(productVariants, { fields: [orderItems.productVariantId], references: [productVariants.id] }),
}));

export const orderItemSchema = {
  insert: z.object({
    orderId: z.string().uuid(),
    productVariantId: z.string().uuid(),
    quantity: z.number().int().min(1),
    priceAtPurchase: z.number(),
  }),
  select: z.object({
    id: z.string().uuid(),
  })
};

export type InsertOrderItem = z.infer<typeof orderItemSchema.insert>;
export type SelectOrderItem = z.infer<typeof orderItemSchema.select>;