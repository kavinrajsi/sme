import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_case_studies_seo_twitter_card" AS ENUM('summary_large_image', 'summary');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "seo_og_image_id" integer;
    ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "seo_twitter_card" "enum_case_studies_seo_twitter_card" DEFAULT 'summary_large_image';

    ALTER TABLE "case_studies"
      DROP CONSTRAINT IF EXISTS "case_studies_seo_og_image_id_media_id_fk";
    ALTER TABLE "case_studies"
      ADD CONSTRAINT "case_studies_seo_og_image_id_media_id_fk"
      FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "case_studies_seo_seo_og_image_idx"
      ON "case_studies" USING btree ("seo_og_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "case_studies" DROP CONSTRAINT IF EXISTS "case_studies_seo_og_image_id_media_id_fk";
    DROP INDEX IF EXISTS "case_studies_seo_seo_og_image_idx";
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "seo_meta_title";
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "seo_meta_description";
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "seo_og_image_id";
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "seo_twitter_card";
    DROP TYPE IF EXISTS "public"."enum_case_studies_seo_twitter_card";
  `)
}
