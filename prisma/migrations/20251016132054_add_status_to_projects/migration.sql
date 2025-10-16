/*
  Warnings:

  - You are about to drop the column `setorId` on the `projetos` table. All the data in the column will be lost.
  - You are about to drop the `_ProjetoToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ProjetoToUser" DROP CONSTRAINT "_ProjetoToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProjetoToUser" DROP CONSTRAINT "_ProjetoToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."projetos" DROP CONSTRAINT "projetos_setorId_fkey";

-- AlterTable
ALTER TABLE "projetos" DROP COLUMN "setorId",
ADD COLUMN     "start_date" TIMESTAMP(3),
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'PLANEJAMENTO';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."_ProjetoToUser";
