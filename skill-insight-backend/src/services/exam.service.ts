import * as examRepo from "../repositories/exam.repository";
import prisma from "../lib/prisma";

import * as XLSX from "xlsx";

export const createExam = async (
  data: any
) => {

  const isAdmin = data.role === "admin";

  const allowIntegration =
    !isAdmin &&
    (
      data.allow_system_integration === true ||
      data.allow_system_integration === "true"
    );

  // =====================================
  // CREATE EXAM
  // =====================================

  const exam = await examRepo.create({

    title: data.title,

    description: data.description,

    subject_id: Number(data.subject_id),

    topic_id: data.topic_id
      ? Number(data.topic_id)
      : null,

    teacher_id: Number(data.teacher_id),

    duration: Number(data.duration),

    pass_score: Number(data.pass_score),

    // ==========================
    // ADMIN / TEACHER
    // ==========================
    source: isAdmin
      ? "SYSTEM"
      : "TEACHER",

    visibility: isAdmin
      ? "SYSTEM_BANK"
      : "PRIVATE",

    status_exam: isAdmin
      ? "APPROVED"
      : "DRAFT",

    allow_system_integration: isAdmin
      ? true
      : false,

    is_random:
      data.is_random === true ||
      data.is_random === "true",

    random_question_count:
      Number(data.random_question_count) || 0

  });

  // =====================================
  // RANDOM QUESTION
  // =====================================

  if (
    exam.is_random &&
    exam.random_question_count > 0
  ) {

    const randomQuestions =
      await prisma.question.findMany({

        where: {

          subject_id:
            Number(data.subject_id),

          topic_id:
            data.topic_id
              ? Number(data.topic_id)
              : undefined,

          is_active: true

        },

        take:
          exam.random_question_count

      });

    if (randomQuestions.length > 0) {

      await examRepo.addQuestionsToExam(

        exam.exam_id,

        randomQuestions.map(
          q => q.question_id
        )

      );

    }

  }

  // =====================================
  // QUESTION BANK
  // =====================================

  else if (
    data.create_mode === "QUESTION_BANK"
  ) {

    const ids = JSON.parse(
      data.question_ids || "[]"
    );

    if (ids.length > 0) {

      await examRepo.addQuestionsToExam(
        exam.exam_id,
        ids
      );

    }

  }

  // =====================================
  // MANUAL
  // =====================================

  else if (
    data.create_mode === "MANUAL"
  ) {

    const questions = JSON.parse(
      data.questions || "[]"
    );

    let order = 1;

    for (const q of questions) {

      const question =
        await examRepo.createQuestion({

          subject_id: data.subject_id,

          topic_id: data.topic_id,

          teacher_id: data.teacher_id,

          content: q.content,

          level: q.difficulty,

          explanation: q.explanation

        });

      await examRepo.createAnswers(

        question.question_id,

        [

          {
            text: q.answer_a,
            correct: q.correct_answer === "A"
          },

          {
            text: q.answer_b,
            correct: q.correct_answer === "B"
          },

          {
            text: q.answer_c,
            correct: q.correct_answer === "C"
          },

          {
            text: q.answer_d,
            correct: q.correct_answer === "D"
          }

        ]

      );

      await prisma.examQuestion.create({

        data: {

          exam_id: exam.exam_id,

          question_id: question.question_id,

          question_order: order++,

          points: 1

        }

      });

    }

  }

  // =====================================
  // IMPORT
  // =====================================

  else if (data.create_mode === "IMPORT") {

    if (!data.file) {
      throw new Error("Chưa chọn file Excel");
    }

    let workbook;

      const ext = data.file.originalname
          .split(".")
          .pop()
          ?.toLowerCase();

      if (ext === "csv") {

        workbook = XLSX.read(
            data.file.buffer.toString("utf8"),
            {
                type: "string"
            }
        );

    } else {

        workbook = XLSX.read(
            data.file.buffer,
            {
                type: "buffer"
            }
        );

    }

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows: any[] =
      XLSX.utils.sheet_to_json(sheet);
      rows.forEach((row: any) => {

  Object.keys(row).forEach(key => {

    const cleanKey = key.replace(/^\uFEFF/, "");

    if (cleanKey !== key) {
      row[cleanKey] = row[key];
      delete row[key];
    }

  });

});

      console.log(rows);
      console.log(rows[0]);

    let order = 1;

    for (const row of rows) {

      const question =
        await examRepo.createQuestion({

          subject_id: data.subject_id,

          topic_id: data.topic_id,

          teacher_id: data.teacher_id,

          content: row.question,

          level: row.difficulty || "EASY",

          explanation: row.explanation || ""

        });

      await examRepo.createAnswers(

        question.question_id,

        [

          {
            text: row.option_a,
            correct:
              row.correct_answer === "A"
          },

          {
            text: row.option_b,
            correct:
              row.correct_answer === "B"
          },

          {
            text: row.option_c,
            correct:
              row.correct_answer === "C"
          },

          {
            text: row.option_d,
            correct:
              row.correct_answer === "D"
          }

        ]

      );

      await prisma.examQuestion.create({

        data: {

          exam_id: exam.exam_id,

          question_id:
            question.question_id,

          question_order: order++,

          points: 1

        }

      });

    }

  }

  // =====================================

  return await examRepo.findById(
    exam.exam_id
  );

};

export const getExam = async (
  id: string
) => {

  return await examRepo.findById(

    Number(id)

  );

};