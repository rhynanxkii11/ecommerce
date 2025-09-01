ALTER TABLE "product_images" DROP CONSTRAINT "product_images_product_id_products_id_fk";
--> statement-breakpoint
DROP INDEX "brands_slug_unique";--> statement-breakpoint
DROP INDEX "collections_slug_unique";--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "color_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "size_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_sku_unique" UNIQUE("sku");--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_code_unique" UNIQUE("code");