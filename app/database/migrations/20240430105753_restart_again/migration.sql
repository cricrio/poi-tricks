/*
  Warnings:

  - The primary key for the `CreatorPlatform` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CreatorPlatform` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `platform` column on the `CreatorPlatform` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Trick` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creatorId` on the `Trick` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `_CreatorToTrick` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `CreatorPlatform` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `CreatorPlatform` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('youtube');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContributionAction" ADD VALUE 'publish';
ALTER TYPE "ContributionAction" ADD VALUE 'connect';
ALTER TYPE "ContributionAction" ADD VALUE 'disconnect';

-- DropForeignKey
ALTER TABLE "Trick" DROP CONSTRAINT "Trick_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "_CreatorToTrick" DROP CONSTRAINT "_CreatorToTrick_A_fkey";

-- DropForeignKey
ALTER TABLE "_CreatorToTrick" DROP CONSTRAINT "_CreatorToTrick_B_fkey";

-- DropForeignKey
ALTER TABLE "_Prerequisite" DROP CONSTRAINT "_Prerequisite_A_fkey";

-- DropForeignKey
ALTER TABLE "_Prerequisite" DROP CONSTRAINT "_Prerequisite_B_fkey";

-- DropForeignKey
ALTER TABLE "_TagToTrick" DROP CONSTRAINT "_TagToTrick_B_fkey";

-- AlterTable
ALTER TABLE "CreatorPlatform" DROP CONSTRAINT "CreatorPlatform_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "platform",
ADD COLUMN     "platform" "Platform",
ADD CONSTRAINT "CreatorPlatform_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Trick" DROP CONSTRAINT "Trick_pkey",
DROP COLUMN "creatorId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Trick_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "creatorId",
ADD COLUMN     "creatorPlatformId" UUID;

-- AlterTable
ALTER TABLE "_Prerequisite" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_TagToTrick" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "_CreatorToTrick";

-- CreateIndex
CREATE UNIQUE INDEX "CreatorPlatform_id_key" ON "CreatorPlatform"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorPlatform_externalId_key" ON "CreatorPlatform"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Video_externalId_key" ON "Video"("externalId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_creatorPlatformId_fkey" FOREIGN KEY ("creatorPlatformId") REFERENCES "CreatorPlatform"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prerequisite" ADD CONSTRAINT "_Prerequisite_A_fkey" FOREIGN KEY ("A") REFERENCES "Trick"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prerequisite" ADD CONSTRAINT "_Prerequisite_B_fkey" FOREIGN KEY ("B") REFERENCES "Trick"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTrick" ADD CONSTRAINT "_TagToTrick_B_fkey" FOREIGN KEY ("B") REFERENCES "Trick"("id") ON DELETE CASCADE ON UPDATE CASCADE;
