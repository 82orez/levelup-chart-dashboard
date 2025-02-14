/*
  Warnings:

  - Made the column `credentials` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credentials" SET NOT NULL,
ALTER COLUMN "credentials" SET DEFAULT false;
