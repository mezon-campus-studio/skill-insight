import * as examRepo from "../repositories/exam.repository";

import prisma from "../lib/prisma";

export const createExam = async (
  data: any
) => {

  let questions: any[] = [];

  /**
   * RANDOM QUESTION
   */
  if (data.random) {

    questions =
      await prisma.question.findMany({

        where: {
          level: data.level,
        },

        take: Number(
          data.numberOfQuestions
        ),

      });

  }

  /**
   * CREATE EXAM
   */
  const exam =
    await examRepo.create({

      title: data.title,

      duration: Number(data.duration),

      teacher_id: Number(data.teacher_id),

      subject_id: Number(data.subject_id),

      status_exam:
        data.status_exam || "DRAFT",

    });

  /**
   * ADD QUESTIONS
   */
  if (questions.length > 0) {

    await examRepo.addQuestionsToExam(
      exam.exam_id,
      questions
    );

  }

  return exam;

};

export const getExam = async (
  id: string
) => {

  return await examRepo.findById(
    Number(id)
  );

};