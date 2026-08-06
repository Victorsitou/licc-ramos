/*
  Warnings:

  - You are about to drop the column `setId` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the `ProblemSet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[collectionId,orderIndex]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `collectionId` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProblemCollectionType" AS ENUM ('SET', 'ENSAYO', 'INTERROGACION', 'COMPILADO');

-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_setId_fkey";

-- DropIndex
DROP INDEX "Problem_setId_orderIndex_idx";

-- DropIndex
DROP INDEX "Problem_setId_orderIndex_key";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "setId",
ADD COLUMN     "collectionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProblemSet";

-- CreateTable
CREATE TABLE "ProblemCollection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "type" "ProblemCollectionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProblemCollection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemCollection_type_orderIndex_key" ON "ProblemCollection"("type", "orderIndex");

-- CreateIndex
CREATE INDEX "Problem_collectionId_orderIndex_idx" ON "Problem"("collectionId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_collectionId_orderIndex_key" ON "Problem"("collectionId", "orderIndex");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "ProblemCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
