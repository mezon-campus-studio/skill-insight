-- DropForeignKey
ALTER TABLE `practice_histories` DROP FOREIGN KEY `practice_histories_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `practice_histories` DROP FOREIGN KEY `practice_histories_topic_id_fkey`;

-- DropForeignKey
ALTER TABLE `questions` DROP FOREIGN KEY `questions_topic_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_weaknesses` DROP FOREIGN KEY `student_weaknesses_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_weaknesses` DROP FOREIGN KEY `student_weaknesses_topic_id_fkey`;

-- DropIndex
DROP INDEX `exams_status_exam_idx` ON `exams`;

-- DropIndex
DROP INDEX `question_batches_created_at_idx` ON `question_batches`;

-- DropIndex
DROP INDEX `question_batches_status_idx` ON `question_batches`;

-- DropIndex
DROP INDEX `questions_created_at_idx` ON `questions`;

-- DropIndex
DROP INDEX `questions_visibility_created_by_idx` ON `questions`;

-- AlterTable
ALTER TABLE `exams` ADD COLUMN `allow_system_integration` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `integrated_at` DATETIME(3) NULL,
    ADD COLUMN `integrated_batch_id` INTEGER NULL,
    ADD COLUMN `topic_id` INTEGER NULL,
    ADD COLUMN `visibility` ENUM('PRIVATE', 'SYSTEM_BANK') NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE `practice_histories` MODIFY `topic_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `questions` MODIFY `topic_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `exams_title_idx` ON `exams`(`title`);

-- CreateIndex
CREATE INDEX `exams_topic_id_idx` ON `exams`(`topic_id`);

-- CreateIndex
CREATE INDEX `exams_visibility_idx` ON `exams`(`visibility`);

-- CreateIndex
CREATE INDEX `practice_histories_student_id_created_at_idx` ON `practice_histories`(`student_id`, `created_at`);

-- CreateIndex
CREATE INDEX `question_batches_status_created_at_idx` ON `question_batches`(`status`, `created_at`);

-- CreateIndex
CREATE INDEX `question_batches_teacher_id_status_created_at_idx` ON `question_batches`(`teacher_id`, `status`, `created_at`);

-- CreateIndex
CREATE INDEX `questions_subject_id_topic_id_created_at_idx` ON `questions`(`subject_id`, `topic_id`, `created_at`);

-- CreateIndex
CREATE INDEX `questions_subject_id_is_active_idx` ON `questions`(`subject_id`, `is_active`);

-- CreateIndex
CREATE INDEX `questions_subject_id_visibility_idx` ON `questions`(`subject_id`, `visibility`);

-- CreateIndex
CREATE INDEX `questions_created_by_created_at_idx` ON `questions`(`created_by`, `created_at`);

-- CreateIndex
CREATE INDEX `questions_subject_id_visibility_is_active_idx` ON `questions`(`subject_id`, `visibility`, `is_active`);

-- CreateIndex
CREATE INDEX `student_weaknesses_student_id_topic_id_idx` ON `student_weaknesses`(`student_id`, `topic_id`);

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`topic_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`topic_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_integrated_batch_id_fkey` FOREIGN KEY (`integrated_batch_id`) REFERENCES `question_batches`(`batch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_weaknesses` ADD CONSTRAINT `student_weaknesses_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_weaknesses` ADD CONSTRAINT `student_weaknesses_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`topic_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `practice_histories` ADD CONSTRAINT `practice_histories_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `practice_histories` ADD CONSTRAINT `practice_histories_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`topic_id`) ON DELETE SET NULL ON UPDATE CASCADE;
