/*
  Warnings:

  - The values [ENSAYO] on the enum `ProblemCollectionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProblemCollectionType_new" AS ENUM ('SET', 'ACTIVIDAD', 'INTERROGACION', 'COMPILADO');
ALTER TABLE "ProblemCollection" ALTER COLUMN "type" TYPE "ProblemCollectionType_new" USING ("type"::text::"ProblemCollectionType_new");
ALTER TYPE "ProblemCollectionType" RENAME TO "ProblemCollectionType_old";
ALTER TYPE "ProblemCollectionType_new" RENAME TO "ProblemCollectionType";
DROP TYPE "public"."ProblemCollectionType_old";
COMMIT;
