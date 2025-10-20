/*
  Warnings:

  - A unique constraint covering the columns `[name,sector_id]` on the table `projetos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "projetos_name_sector_id_key" ON "projetos"("name", "sector_id");