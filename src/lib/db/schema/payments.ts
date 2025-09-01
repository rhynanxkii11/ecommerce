import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { orders } from "./orders";

export const paymentMethod = pgEnum("payment_method", ["stripe", "paypal", "cod"]);
export const paymentStatus = pgEnum("payment_status", ["initiated", "completed", "failed"]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  method: paymentMethod("method").notNull(),
  status: paymentStatus("status").notNull().default("initiated"),
  paidAt: timestamp("paid_at"),
  transactionId: text("transaction_id"),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const paymentSchema = {
  insert: z.object({
    orderId: z.string().uuid(),
    method: z.enum(["stripe", "paypal", "cod"]),
    status: z.enum(["initiated", "completed", "failed"]).optional(),
    paidAt: z.date().optional().nullable(),
    transactionId: z.string().optional().nullable(),
  }),
  select: z.object({
    id: z.string().uuid(),
  })
};

export type InsertPayment = z.infer<typeof paymentSchema.insert>;
export type SelectPayment = z.infer<typeof paymentSchema.select>;