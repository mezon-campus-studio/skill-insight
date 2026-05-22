/*
  Warnings:

  - You are about to drop the column `batch_id` on the `questions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `questions` DROP FOREIGN KEY `questions_batch_id_fkey`;

-- DropIndex
DROP INDEX `questions_batch_id_is_active_idx` ON `questions`;

-- DropIndex
DROP INDEX `questions_batch_id_level_idx` ON `questions`;

-- DropIndex
DROP INDEX `questions_topic_id_is_active_idx` ON `questions`;

-- DropIndex
DROP INDEX `questions_visibility_is_active_idx` ON `questions`;

-- AlterTable
ALTER TABLE `questions` DROP COLUMN `batch_id`;

-- CreateTable
CREATE TABLE `question_batch_questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `batch_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `question_order` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `question_batch_questions_batch_id_question_order_idx`(`batch_id`, `question_order`),
    INDEX `question_batch_questions_question_id_idx`(`question_id`),
    UNIQUE INDEX `question_batch_questions_batch_id_question_id_key`(`batch_id`, `question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `student_answer_options_student_answer_id_answer_id_idx` ON `student_answer_options`(`student_answer_id`, `answer_id`);

-- AddForeignKey
ALTER TABLE `question_batch_questions` ADD CONSTRAINT `question_batch_questions_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `question_batches`(`batch_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_batch_questions` ADD CONSTRAINT `question_batch_questions_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;
