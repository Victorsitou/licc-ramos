/*
  Warnings:

  - You are about to drop the `UserProblemSetProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProblemSetProgress" DROP CONSTRAINT "UserProblemSetProgress_setId_fkey";

-- DropForeignKey
ALTER TABLE "UserProblemSetProgress" DROP CONSTRAINT "UserProblemSetProgress_userId_fkey";

-- DropTable
DROP TABLE "UserProblemSetProgress";

-- CreateTable
CREATE TABLE "UserProblemProgress" (
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProblemProgress_pkey" PRIMARY KEY ("userId","problemId")
);

-- CreateIndex
CREATE INDEX "UserProblemProgress_problemId_idx" ON "UserProblemProgress"("problemId");

-- AddForeignKey
ALTER TABLE "UserProblemProgress" ADD CONSTRAINT "UserProblemProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProblemProgress" ADD CONSTRAINT "UserProblemProgress_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
