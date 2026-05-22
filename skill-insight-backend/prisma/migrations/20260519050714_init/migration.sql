/*
  Warnings:

  - You are about to drop the column `difficulty` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_questions` on the `exams` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_id` on the `questions` table. All the data in the column will be lost.
  - You are about to alter the column `visibility` on the `questions` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(10))` to `Enum(EnumId(4))`.
  - You are about to drop the column `exam_id` on the `results` table. All the data in the column will be lost.
  - You are about to drop the `class_exams` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[student_id,assignment_id,attempt_no]` on the table `results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_by` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignment_id` to the `results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `class_exams` DROP FOREIGN KEY `class_exams_class_id_fkey`;

-- DropForeignKey
ALTER TABLE `class_exams` DROP FOREIGN KEY `class_exams_exam_id_fkey`;

-- DropForeignKey
ALTER TABLE `questions` DROP FOREIGN KEY `questions_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `results` DROP FOREIGN KEY `results_exam_id_fkey`;

-- DropIndex
DROP INDEX `exams_difficulty_idx` ON `exams`;

-- DropIndex
DROP INDEX `exams_teacher_id_status_exam_idx` ON `exams`;

-- DropIndex
DROP INDEX `questions_subject_id_topic_id_idx` ON `questions`;

-- DropIndex
DROP INDEX `questions_teacher_id_created_at_idx` ON `questions`;

-- DropIndex
DROP INDEX `questions_topic_id_level_idx` ON `questions`;

-- DropIndex
DROP INDEX `results_student_id_exam_id_idx` ON `results`;

-- AlterTable
ALTER TABLE `exams` DROP COLUMN `difficulty`,
    DROP COLUMN `number_of_questions`;

-- AlterTable
ALTER TABLE `questions` DROP COLUMN `teacher_id`,
    ADD COLUMN `created_by` INTEGER NOT NULL,
    MODIFY `visibility` ENUM('PRIVATE', 'SYSTEM_BANK') NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE `results` DROP COLUMN `exam_id`,
    ADD COLUMN `assignment_id` INTEGER NOT NULL,
    ADD COLUMN `attempt_no` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `ip_address` VARCHAR(100) NULL,
    ADD COLUMN `tab_switch_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `user_agent` TEXT NULL;

-- DropTable
DROP TABLE `class_exams`;

-- CreateTable
CREATE TABLE `assignments` (
    `assignment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_id` INTEGER NOT NULL,
    `class_id` INTEGER NOT NULL,
    `teacher_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NULL,
    `start_at` DATETIME(3) NOT NULL,
    `end_at` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'CLOSED') NOT NULL DEFAULT 'DRAFT',
    `allow_review` BOOLEAN NOT NULL DEFAULT true,
    `show_answer` BOOLEAN NOT NULL DEFAULT false,
    `max_attempts` INTEGER NOT NULL DEFAULT 1,
    `published_at` DATETIME(3) NULL,
    `closed_at` DATETIME(3) NULL,

    INDEX `assignments_exam_id_idx`(`exam_id`),
    INDEX `assignments_class_id_idx`(`class_id`),
    INDEX `assignments_teacher_id_idx`(`teacher_id`),
    INDEX `assignments_start_at_idx`(`start_at`),
    INDEX `assignments_end_at_idx`(`end_at`),
    UNIQUE INDEX `assignments_exam_id_class_id_start_at_key`(`exam_id`, `class_id`, `start_at`),
    PRIMARY KEY (`assignment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignment_questions` (
    `assignment_question_id` INTEGER NOT NULL AUTO_INCREMENT,
    `assignment_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `question_order` INTEGER NOT NULL,
    `points` DOUBLE NOT NULL DEFAULT 1,
    `question_snapshot` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `assignment_questions_assignment_id_idx`(`assignment_id`),
    INDEX `assignment_questions_question_id_idx`(`question_id`),
    UNIQUE INDEX `assignment_questions_assignment_id_question_id_key`(`assignment_id`, `question_id`),
    PRIMARY KEY (`assignment_question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `class_posts_created_at_idx` ON `class_posts`(`created_at`);

-- CreateIndex
CREATE INDEX `class_students_class_id_idx` ON `class_students`(`class_id`);

-- CreateIndex
CREATE INDEX `post_comments_created_at_idx` ON `post_comments`(`created_at`);

-- CreateIndex
CREATE INDEX `questions_created_by_idx` ON `questions`(`created_by`);

-- CreateIndex
CREATE INDEX `questions_visibility_created_by_idx` ON `questions`(`visibility`, `created_by`);

-- CreateIndex
CREATE INDEX `results_assignment_id_idx` ON `results`(`assignment_id`);

-- CreateIndex
CREATE UNIQUE INDEX `results_student_id_assignment_id_attempt_no_key` ON `results`(`student_id`, `assignment_id`, `attempt_no`);

-- CreateIndex
CREATE INDEX `student_weaknesses_student_id_idx` ON `student_weaknesses`(`student_id`);

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignment_questions` ADD CONSTRAINT `assignment_questions_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`assignment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignment_questions` ADD CONSTRAINT `assignment_questions_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `results_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`assignment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `class_posts` RENAME INDEX `class_posts_class_id_fkey` TO `class_posts_class_id_idx`;

-- RenameIndex
ALTER TABLE `class_posts` RENAME INDEX `class_posts_user_id_fkey` TO `class_posts_user_id_idx`;

-- RenameIndex
ALTER TABLE `class_students` RENAME INDEX `class_students_student_id_fkey` TO `class_students_student_id_idx`;

-- RenameIndex
ALTER TABLE `post_comments` RENAME INDEX `post_comments_post_id_fkey` TO `post_comments_post_id_idx`;

-- RenameIndex
ALTER TABLE `post_comments` RENAME INDEX `post_comments_user_id_fkey` TO `post_comments_user_id_idx`;

-- RenameIndex
ALTER TABLE `student_weaknesses` RENAME INDEX `student_weaknesses_topic_id_fkey` TO `student_weaknesses_topic_id_idx`;
