/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `sectors` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "sectors" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "deleted_at",
DROP COLUMN "is_deleted",
ALTER COLUMN "role" DROP DEFAULT;
