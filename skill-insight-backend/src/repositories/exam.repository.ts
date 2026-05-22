import prisma from "../lib/prisma";

export const create = async (data: any) => {

  return await prisma.exam.create({
    data: {
      title: data.title,
      duration: data.duration,
      teacher_id: data.teacher_id,
      subject_id: data.subject_id,
      status_exam: data.status_exam || "DRAFT",
    },
  });

};

export const addQuestionsToExam = async (
  examId: number,
  questions: any[]
) => {

  return await prisma.examQuestion.createMany({
    data: questions.map((q: any) => ({
      exam_id: examId,
      question_id: q.question_id,
      topic_id: q.topic_id,
      content: q.content,
      level: q.level,
    })),
  });

};

export const findById = async (
  examId: number
) => {

  return await prisma.exam.findUnique({
    where: {
      exam_id: examId,
    },

    include: {

      subject: true,

      exam_questions: {

        include: {

          question: {
            include: {
              answers: true,
            },
          },

        },

      },

    },

  });

};