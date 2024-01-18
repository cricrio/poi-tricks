-- CreateEnum
CREATE TYPE "TrickDifficulty" AS ENUM ('others', 'beginner', 'intermediate', 'basics', 'advanced');

-- CreateTable
CREATE TABLE "Collection" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creator" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "bio" TEXT,
    "picture" TEXT,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorPlatform" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "platform" TEXT,
    "url" TEXT,
    "externalId" TEXT,
    "creatorId" UUID,

    CONSTRAINT "CreatorPlatform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trick" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "preview" TEXT,
    "difficulty" "TrickDifficulty" NOT NULL,
    "types" TEXT[],

    CONSTRAINT "Trick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalId" TEXT,
    "source" TEXT,
    "trickId" UUID,
    "title" TEXT,
    "creatorId" UUID,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CollectionToTrick" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_CreatorToTrick" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_Prerequisite" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_id_key" ON "Collection"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_id_key" ON "Creator"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorPlatform_url_key" ON "CreatorPlatform"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Trick_id_key" ON "Trick"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToTrick_AB_unique" ON "_CollectionToTrick"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToTrick_B_index" ON "_CollectionToTrick"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CreatorToTrick_AB_unique" ON "_CreatorToTrick"("A", "B");

-- CreateIndex
CREATE INDEX "_CreatorToTrick_B_index" ON "_CreatorToTrick"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Prerequisite_AB_unique" ON "_Prerequisite"("A", "B");

-- CreateIndex
CREATE INDEX "_Prerequisite_B_index" ON "_Prerequisite"("B");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorPlatform" ADD CONSTRAINT "CreatorPlatform_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_trickId_fkey" FOREIGN KEY ("trickId") REFERENCES "Trick"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_CollectionToTrick" ADD CONSTRAINT "_CollectionToTrick_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToTrick" ADD CONSTRAINT "_CollectionToTrick_B_fkey" FOREIGN KEY ("B") REFERENCES "Trick"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreatorToTrick" ADD CONSTRAINT "_CreatorToTrick_A_fkey" FOREIGN KEY ("A") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreatorToTrick" ADD CONSTRAINT "_CreatorToTrick_B_fkey" FOREIGN KEY ("B") REFERENCES "Trick"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prerequisite" ADD CONSTRAINT "_Prerequisite_A_fkey" FOREIGN KEY ("A") REFERENCES "Trick"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prerequisite" ADD CONSTRAINT "_Prerequisite_B_fkey" FOREIGN KEY ("B") REFERENCES "Trick"("id") ON DELETE CASCADE ON UPDATE CASCADE;
