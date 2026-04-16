/*
  Warnings:

  - You are about to drop the column `completed` on the `user_resource_progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_resource_progress" DROP COLUMN "completed",
ALTER COLUMN "completedAt" SET DEFAULT CURRENT_TIMESTAMP;
