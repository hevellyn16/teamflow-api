/*
  Warnings:

  - Added the required column `setorId` to the `projetos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projetos" ADD COLUMN     "setorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_ProjetoToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjetoToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjetoToUser_B_index" ON "_ProjetoToUser"("B");

-- AddForeignKey
ALTER TABLE "projetos" ADD CONSTRAINT "projetos_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "setores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjetoToUser" ADD CONSTRAINT "_ProjetoToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjetoToUser" ADD CONSTRAINT "_ProjetoToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
