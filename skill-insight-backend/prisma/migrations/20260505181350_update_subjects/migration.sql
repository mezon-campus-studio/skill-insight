/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Made the column `role` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `subjects` ADD COLUMN `created_by` INT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('admin', 'teacher', 'student') NULL;


-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
