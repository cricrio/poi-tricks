/*
  Warnings:

  - You are about to drop the column `userId` on the `Contribution` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Contribution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Trick` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_userId_fkey";

-- AlterTable
ALTER TABLE "Contribution" DROP COLUMN "userId",
ADD COLUMN     "authorId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Trick" ADD COLUMN     "creatorId" UUID NOT NULL,
ADD COLUMN     "draft" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "preview" DROP NOT NULL,
ALTER COLUMN "difficulty" DROP NOT NULL,
ALTER COLUMN "difficulty" SET DEFAULT 'others';

-- AddForeignKey
ALTER TABLE "Trick" ADD CONSTRAINT "Trick_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
