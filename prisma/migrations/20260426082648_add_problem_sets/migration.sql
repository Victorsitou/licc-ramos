/*
  Warnings:

  - You are about to drop the `Set` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SetGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSetProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserSetProgress" DROP CONSTRAINT "UserSetProgress_setId_fkey";

-- DropForeignKey
ALTER TABLE "UserSetProgress" DROP CONSTRAINT "UserSetProgress_userId_fkey";

-- DropTable
DROP TABLE "Set";

-- DropTable
DROP TABLE "SetGroup";

-- DropTable
DROP TABLE "UserSetProgress";

-- CreateTable
CREATE TABLE "ProblemSet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProblemSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "setId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProblemSetProgress" (
    "userId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProblemSetProgress_pkey" PRIMARY KEY ("userId","setId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemSet_orderIndex_key" ON "ProblemSet"("orderIndex");

-- CreateIndex
CREATE INDEX "Problem_setId_orderIndex_idx" ON "Problem"("setId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_setId_orderIndex_key" ON "Problem"("setId", "orderIndex");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_setId_fkey" FOREIGN KEY ("setId") REFERENCES "ProblemSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProblemSetProgress" ADD CONSTRAINT "UserProblemSetProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProblemSetProgress" ADD CONSTRAINT "UserProblemSetProgress_setId_fkey" FOREIGN KEY ("setId") REFERENCES "ProblemSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
