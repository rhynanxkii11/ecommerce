import { pgTable, uuid, text, integer, numeric, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { z } from "zod";

export const coupons = pgTable("coupons", {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull().unique(),
    discountType: text("discount_type").notNull(),
    discountValue: numeric("discount_value").notNull(),
    expiresAt: timestamp("expires_at"),
    maxUsage: integer("max_usage").notNull().default(0),
    usedCount: integer("used_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const couponSchema = {
  insert: z.object({
    code: z.string().min(1),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number(),
    expiresAt: z.string().optional().nullable(),
    maxUsage: z.number().nonnegative().optional(),
    usedCount: z.number().nonnegative().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  }),
  select: z.object({
    id: z.string().uuid(),
  })
};

export type InsertCoupon = z.infer<typeof couponSchema.insert>;
export type SelectCoupon = z.infer<typeof couponSchema.select>;