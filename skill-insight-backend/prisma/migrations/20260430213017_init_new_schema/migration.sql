/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `full_name` VARCHAR(255) NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `password` VARCHAR(255) NULL,
    MODIFY `role` ENUM('admin', 'teacher', 'student') NULL,
    MODIFY `provider_id` VARCHAR(255) NULL;
