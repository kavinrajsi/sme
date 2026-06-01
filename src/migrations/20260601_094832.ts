import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "case_studies_services" CASCADE;
    DROP TABLE IF EXISTS "case_studies_metrics" CASCADE;
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "industry";
    ALTER TABLE "case_studies" DROP COLUMN IF EXISTS "duration";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "case_studies" ADD COLUMN "industry" varchar NOT NULL DEFAULT '';
    ALTER TABLE "case_studies" ADD COLUMN "duration" varchar NOT NULL DEFAULT '';
    CREATE TABLE IF NOT EXISTS "case_studies_services" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "case_studies_metrics" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "value" varchar NOT NULL
    );
  `)
}
