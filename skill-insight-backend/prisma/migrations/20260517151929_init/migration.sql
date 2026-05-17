/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[subject_name,created_by]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - Made the column `created_by` on table `subjects` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `subjects_created_by_fkey`;

-- AlterTable
ALTER TABLE `subjects` MODIFY `created_by` INTEGER NOT NULL;

-- DropTable
DROP TABLE `user`;

-- CreateIndex
CREATE UNIQUE INDEX `subjects_subject_name_created_by_key` ON `subjects`(`subject_name`, `created_by`);

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `subjects` RENAME INDEX `subjects_created_by_fkey` TO `subjects_created_by_idx`;
