/*
  Warnings:

  - Added the required column `creator_id` to the `topics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `topics` ADD COLUMN `creator_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `topics_creator_id_idx` ON `topics`(`creator_id`);

-- AddForeignKey
ALTER TABLE `topics` ADD CONSTRAINT `topics_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
