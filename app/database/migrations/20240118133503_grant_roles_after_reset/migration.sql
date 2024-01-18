/*
  Warnings:

  - Made the column `name` on table `Creator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `Creator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `picture` on table `Creator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `preview` on table `Trick` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Creator" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "bio" SET DEFAULT '',
ALTER COLUMN "picture" SET NOT NULL,
ALTER COLUMN "picture" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Trick" ALTER COLUMN "preview" SET NOT NULL,
ALTER COLUMN "preview" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DEFAULT '';
