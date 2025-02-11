/*
  Warnings:

  - The primary key for the `test` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `age` on the `test` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `test` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "test" DROP CONSTRAINT "test_pkey",
DROP COLUMN "age",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ADD CONSTRAINT "test_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "test_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "test_email_key" ON "test"("email");
