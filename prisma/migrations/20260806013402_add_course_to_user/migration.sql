-- AlterTable
ALTER TABLE "users" ADD COLUMN     "courses" TEXT[] DEFAULT ARRAY[]::TEXT[];
