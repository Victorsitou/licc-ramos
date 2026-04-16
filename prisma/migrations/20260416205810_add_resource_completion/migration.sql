-- AlterTable
ALTER TABLE "user_resource_progress" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "completedAt" DROP DEFAULT;
