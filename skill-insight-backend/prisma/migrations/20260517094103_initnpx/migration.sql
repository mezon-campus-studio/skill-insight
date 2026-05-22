-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NULL,
    `role` ENUM('admin', 'teacher', 'student') NULL,
    `provider` VARCHAR(50) NULL,
    `provider_id` VARCHAR(255) NULL,
    `avatar_url` TEXT NULL,
    `bio` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `subject_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject_name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `subjects_subject_name_idx`(`subject_name`),
    INDEX `subjects_created_by_idx`(`created_by`),
    INDEX `subjects_created_at_idx`(`created_at`),
    UNIQUE INDEX `subjects_subject_name_key`(`subject_name`),
    PRIMARY KEY (`subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topics` (
    `topic_id` INTEGER NOT NULL AUTO_INCREMENT,
    `topic_name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `subject_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `topics_topic_name_idx`(`topic_name`),
    INDEX `topics_subject_id_idx`(`subject_id`),
    INDEX `topics_created_at_idx`(`created_at`),
    UNIQUE INDEX `topics_topic_name_subject_id_key`(`topic_name`, `subject_id`),
    PRIMARY KEY (`topic_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question_batches` (
    `batch_id` INTEGER NOT NULL AUTO_INCREMENT,
    `batch_code` VARCHAR(100) NOT NULL,
    `batch_name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `rejected_reason` TEXT NULL,
    `import_file_name` VARCHAR(255) NULL,
    `subject_id` INTEGER NOT NULL,
    `topic_id` INTEGER NOT NULL,
    `teacher_id` INTEGER NOT NULL,
    `approved_by` INTEGER NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `approved_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,
    `total_questions` INTEGER NOT NULL DEFAULT 0,
    `easy_count` INTEGER NOT NULL DEFAULT 0,
    `medium_count` INTEGER NOT NULL DEFAULT 0,
    `hard_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `question_batches_batch_code_key`(`batch_code`),
    INDEX `question_batches_subject_id_idx`(`subject_id`),
    INDEX `question_batches_topic_id_idx`(`topic_id`),
    INDEX `question_batches_teacher_id_idx`(`teacher_id`),
    INDEX `question_batches_approved_by_idx`(`approved_by`),
    INDEX `question_batches_status_idx`(`status`),
    INDEX `question_batches_created_at_idx`(`created_at`),
    INDEX `question_batches_deleted_at_idx`(`deleted_at`),
    INDEX `question_batches_subject_id_topic_id_idx`(`subject_id`, `topic_id`),
    PRIMARY KEY (`batch_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `question_id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_code` VARCHAR(100) NULL,
    `subject_id` INTEGER NOT NULL,
    `topic_id` INTEGER NOT NULL,
    `batch_id` INTEGER NULL,
    `teacher_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `content_hash` VARCHAR(64) NOT NULL,
    `image_url` TEXT NULL,
    `explanation` TEXT NULL,
    `question_type` ENUM('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'ESSAY') NOT NULL DEFAULT 'SINGLE_CHOICE',
    `level` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    `points` DOUBLE NOT NULL DEFAULT 1,
    `visibility` ENUM('PRIVATE_EXAM', 'PUBLIC_PRACTICE') NOT NULL DEFAULT 'PRIVATE_EXAM',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `allow_ai_training` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `questions_question_code_key`(`question_code`),
    INDEX `questions_subject_id_idx`(`subject_id`),
    INDEX `questions_topic_id_idx`(`topic_id`),
    INDEX `questions_teacher_id_idx`(`teacher_id`),
    INDEX `questions_batch_id_idx`(`batch_id`),
    INDEX `questions_level_idx`(`level`),
    INDEX `questions_question_type_idx`(`question_type`),
    INDEX `questions_visibility_idx`(`visibility`),
    INDEX `questions_is_active_idx`(`is_active`),
    INDEX `questions_created_at_idx`(`created_at`),
    INDEX `questions_subject_id_topic_id_idx`(`subject_id`, `topic_id`),
    INDEX `questions_batch_id_level_idx`(`batch_id`, `level`),
    INDEX `questions_batch_id_is_active_idx`(`batch_id`, `is_active`),
    INDEX `questions_topic_id_is_active_idx`(`topic_id`, `is_active`),
    INDEX `questions_topic_id_level_idx`(`topic_id`, `level`),
    INDEX `questions_teacher_id_created_at_idx`(`teacher_id`, `created_at`),
    INDEX `questions_visibility_is_active_idx`(`visibility`, `is_active`),
    UNIQUE INDEX `questions_subject_id_content_hash_key`(`subject_id`, `content_hash`),
    PRIMARY KEY (`question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `answers` (
    `answer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `answer_text` TEXT NOT NULL,
    `answer_hash` VARCHAR(64) NOT NULL,
    `answer_order` INTEGER NULL DEFAULT 1,
    `is_correct` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `answers_question_id_idx`(`question_id`),
    INDEX `answers_is_correct_idx`(`is_correct`),
    INDEX `answers_answer_order_idx`(`answer_order`),
    UNIQUE INDEX `answers_question_id_answer_hash_key`(`question_id`, `answer_hash`),
    PRIMARY KEY (`answer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exams` (
    `exam_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `pass_score` DOUBLE NULL,
    `duration` INTEGER NOT NULL,
    `number_of_questions` INTEGER NULL,
    `difficulty` ENUM('EASY', 'MEDIUM', 'HARD') NULL,
    `is_random` BOOLEAN NOT NULL DEFAULT false,
    `status_exam` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `teacher_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `exams_teacher_id_idx`(`teacher_id`),
    INDEX `exams_subject_id_idx`(`subject_id`),
    INDEX `exams_status_exam_idx`(`status_exam`),
    INDEX `exams_difficulty_idx`(`difficulty`),
    INDEX `exams_created_at_idx`(`created_at`),
    INDEX `exams_teacher_id_status_exam_idx`(`teacher_id`, `status_exam`),
    PRIMARY KEY (`exam_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_questions` (
    `exam_question_id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `question_order` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `exam_questions_exam_id_idx`(`exam_id`),
    INDEX `exam_questions_question_id_idx`(`question_id`),
    INDEX `exam_questions_question_order_idx`(`question_order`),
    UNIQUE INDEX `exam_questions_exam_id_question_id_key`(`exam_id`, `question_id`),
    PRIMARY KEY (`exam_question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `class_id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_name` VARCHAR(255) NOT NULL,
    `teacher_id` INTEGER NOT NULL,
    `description` TEXT NULL,
    `class_code` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `classes_class_code_key`(`class_code`),
    INDEX `classes_teacher_id_idx`(`teacher_id`),
    INDEX `classes_class_code_idx`(`class_code`),
    INDEX `classes_created_at_idx`(`created_at`),
    PRIMARY KEY (`class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_students` (
    `class_student_id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `class_students_class_id_student_id_key`(`class_id`, `student_id`),
    PRIMARY KEY (`class_student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_exams` (
    `class_exam_id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `exam_id` INTEGER NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `class_exams_class_id_idx`(`class_id`),
    INDEX `class_exams_exam_id_idx`(`exam_id`),
    INDEX `class_exams_start_time_idx`(`start_time`),
    INDEX `class_exams_end_time_idx`(`end_time`),
    UNIQUE INDEX `class_exams_class_id_exam_id_key`(`class_id`, `exam_id`),
    PRIMARY KEY (`class_exam_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `results` (
    `result_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `exam_id` INTEGER NOT NULL,
    `time_spent` INTEGER NULL,
    `score` DOUBLE NULL,
    `total_questions` INTEGER NOT NULL,
    `correct_answers` INTEGER NOT NULL,
    `status` ENUM('IN_PROGRESS', 'SUBMITTED') NOT NULL DEFAULT 'IN_PROGRESS',
    `start_time` DATETIME(3) NOT NULL,
    `submit_time` DATETIME(3) NULL,
    `ai_feedback` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `results_student_id_idx`(`student_id`),
    INDEX `results_exam_id_idx`(`exam_id`),
    INDEX `results_status_idx`(`status`),
    INDEX `results_created_at_idx`(`created_at`),
    INDEX `results_student_id_exam_id_idx`(`student_id`, `exam_id`),
    PRIMARY KEY (`result_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_answers` (
    `student_answer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `result_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `time_spent` INTEGER NULL,
    `score` DOUBLE NULL,
    `is_correct` BOOLEAN NULL,
    `essay_answer` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `student_answers_result_id_idx`(`result_id`),
    INDEX `student_answers_question_id_idx`(`question_id`),
    INDEX `student_answers_is_correct_idx`(`is_correct`),
    INDEX `student_answers_question_id_is_correct_idx`(`question_id`, `is_correct`),
    UNIQUE INDEX `student_answers_result_id_question_id_key`(`result_id`, `question_id`),
    PRIMARY KEY (`student_answer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_answer_options` (
    `student_answer_option_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_answer_id` INTEGER NOT NULL,
    `answer_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `student_answer_options_student_answer_id_idx`(`student_answer_id`),
    INDEX `student_answer_options_answer_id_idx`(`answer_id`),
    UNIQUE INDEX `student_answer_options_student_answer_id_answer_id_key`(`student_answer_id`, `answer_id`),
    PRIMARY KEY (`student_answer_option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_weaknesses` (
    `weakness_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `topic_id` INTEGER NOT NULL,
    `weakness_score` DOUBLE NOT NULL,
    `recommended_action` TEXT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_weaknesses_student_id_topic_id_key`(`student_id`, `topic_id`),
    PRIMARY KEY (`weakness_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materials` (
    `material_id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `teacher_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `file_url` TEXT NULL,
    `material_type` ENUM('PDF', 'DOC', 'PPT', 'VIDEO', 'LINK') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `materials_class_id_idx`(`class_id`),
    INDEX `materials_teacher_id_idx`(`teacher_id`),
    INDEX `materials_material_type_idx`(`material_type`),
    INDEX `materials_created_at_idx`(`created_at`),
    PRIMARY KEY (`material_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_posts` (
    `post_id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('ANNOUNCEMENT', 'DISCUSSION') NOT NULL DEFAULT 'ANNOUNCEMENT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_comments` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NULL,
    `type` ENUM('NEW_EXAM', 'NEW_MATERIAL', 'NEW_COMMENT', 'NEW_RESULT', 'NEW_POST') NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `reference_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_user_id_idx`(`user_id`),
    INDEX `notifications_type_idx`(`type`),
    INDEX `notifications_is_read_idx`(`is_read`),
    INDEX `notifications_created_at_idx`(`created_at`),
    INDEX `notifications_user_id_is_read_idx`(`user_id`, `is_read`),
    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `practice_histories` (
    `practice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `topic_id` INTEGER NOT NULL,
    `total_questions` INTEGER NOT NULL,
    `correct_answers` INTEGER NOT NULL,
    `score` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `practice_histories_student_id_idx`(`student_id`),
    INDEX `practice_histories_topic_id_idx`(`topic_id`),
    INDEX `practice_histories_created_at_idx`(`created_at`),
    INDEX `practice_histories_student_id_topic_id_idx`(`student_id`, `topic_id`),
    PRIMARY KEY (`practice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topics` ADD CONSTRAINT `topics_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_batches` ADD CONSTRAINT `question_batches_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_batches` ADD CONSTRAINT `question_batches_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`topic_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_batches` ADD CONSTRAINT `question_batches_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_batches` ADD CONSTRAINT `question_batches_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`topic_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `question_batches`(`batch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `answers` ADD CONSTRAINT `answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_questions` ADD CONSTRAINT `exam_questions_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_questions` ADD CONSTRAINT `exam_questions_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_students` ADD CONSTRAINT `class_students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_students` ADD CONSTRAINT `class_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_exams` ADD CONSTRAINT `class_exams_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_exams` ADD CONSTRAINT `class_exams_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`exam_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `results_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `results` ADD CONSTRAINT `results_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`exam_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_answers` ADD CONSTRAINT `student_answers_result_id_fkey` FOREIGN KEY (`result_id`) REFERENCES `results`(`result_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_answers` ADD CONSTRAINT `student_answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_answer_options` ADD CONSTRAINT `student_answer_options_student_answer_id_fkey` FOREIGN KEY (`student_answer_id`) REFERENCES `student_answers`(`student_answer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_answer_options` ADD CONSTRAINT `student_answer_options_answer_id_fkey` FOREIGN KEY (`answer_id`) REFERENCES `answers`(`answer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_weaknesses` ADD CONSTRAINT `student_weaknesses_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_weaknesses` ADD CONSTRAINT `student_weaknesses_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`topic_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materials` ADD CONSTRAINT `materials_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materials` ADD CONSTRAINT `materials_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_posts` ADD CONSTRAINT `class_posts_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_posts` ADD CONSTRAINT `class_posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `class_posts`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `practice_histories` ADD CONSTRAINT `practice_histories_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `practice_histories` ADD CONSTRAINT `practice_histories_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`topic_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
