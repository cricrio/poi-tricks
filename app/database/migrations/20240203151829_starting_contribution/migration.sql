/*
  Warnings:

  - You are about to drop the column `types` on the `Trick` table. All the data in the column will be lost.
  - You are about to drop the `Collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollectionToTrick` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `externalId` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `source` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('waiting', 'rejected', 'approved', 'cancelled');

-- CreateEnum
CREATE TYPE "ContributionAction" AS ENUM ('add', 'remove', 'update');

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_userId_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToTrick" DROP CONSTRAINT "_CollectionToTrick_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToTrick" DROP CONSTRAINT "_CollectionToTrick_B_fkey";

-- AlterTable
ALTER TABLE "Trick" DROP COLUMN "types";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "picture" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "externalId" SET NOT NULL,
ALTER COLUMN "source" SET NOT NULL,
ALTER COLUMN "source" SET DEFAULT 'others';

-- DropTable
DROP TABLE "Collection";

-- DropTable
DROP TABLE "_CollectionToTrick";

-- CreateTable
CREATE TABLE "SavedTrick" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "trickId" UUID NOT NULL,

    CONSTRAINT "SavedTrick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "action" "ContributionAction" NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagToTrick" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedTrick_id_key" ON "SavedTrick"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTrick_AB_unique" ON "_TagToTrick"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTrick_B_index" ON "_TagToTrick"("B");

-- AddForeignKey
ALTER TABLE "SavedTrick" ADD CONSTRAINT "SavedTrick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedTrick" ADD CONSTRAINT "SavedTrick_trickId_fkey" FOREIGN KEY ("trickId") REFERENCES "Trick"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTrick" ADD CONSTRAINT "_TagToTrick_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTrick" ADD CONSTRAINT "_TagToTrick_B_fkey" FOREIGN KEY ("B") REFERENCES "Trick"("id") ON DELETE CASCADE ON UPDATE CASCADE;
