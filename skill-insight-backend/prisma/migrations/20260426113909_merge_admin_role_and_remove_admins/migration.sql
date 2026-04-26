/*
  Warnings:

  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('admin', 'teacher', 'student') NOT NULL;

-- DropTable
DROP TABLE `admins`;
