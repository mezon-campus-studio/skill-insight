import prisma from "../lib/prisma";
import crypto from "crypto";

// =======================================
// HASH
// =======================================

const hash = (text: any) => {
  console.log("HASH =", text);

  return crypto
    .createHash("sha256")
    .update(String(text))
    .digest("hex");
};

// =======================================
// CREATE EXAM
// =======================================

export const create = async (data: any) => {

  return await prisma.exam.create({

    data: {

      title: data.title,

      description: data.description || null,

      subject_id: Number(data.subject_id),

      topic_id:
        data.topic_id
          ? Number(data.topic_id)
          : null,

      teacher_id: Number(data.teacher_id),

      duration: Number(data.duration),

      pass_score: Number(data.pass_score),

      status_exam: data.status_exam,

      visibility: data.visibility,

      source: data.source,

      is_random:
        data.is_random === true ||
        data.is_random === "true",

      random_question_count:
        Number(data.random_question_count) || 0,

      allow_system_integration:
        data.allow_system_integration === true ||
        data.allow_system_integration === "true"

    }

  });

};

// =======================================
// ADD EXISTING QUESTIONS
// =======================================

export const addQuestionsToExam = async (

  examId: number,

  questionIds: number[]

) => {

  return await prisma.examQuestion.createMany({

    data: questionIds.map(

      (id, index) => ({

        exam_id: examId,

        question_id: id,

        question_order: index + 1,

        points: 1

      })

    )

  });

};

// =======================================
// CREATE QUESTION
// =======================================

export const createQuestion = async (data: any) => {

  console.log("CREATE QUESTION =", data);

  if (!data.content) {
    throw new Error("Question content is empty");
  }

  return prisma.question.create({
    data: {

      subject_id: Number(data.subject_id),

      topic_id: data.topic_id
        ? Number(data.topic_id)
        : null,

      created_by: Number(data.teacher_id),

      content: String(data.content),

      content_hash: hash(String(data.content)),

      explanation: data.explanation ?? null,

      question_type: "SINGLE_CHOICE",

      level: data.level || "EASY",

      visibility: "PRIVATE"

    }
  });

};

// =======================================
// CREATE ANSWERS
// =======================================

export const createAnswers = async (

  questionId: number,

  answers: {

    text: string;

    correct: boolean;

  }[]

) => {

  return await prisma.answer.createMany({

    data: answers.map(

      (a, index) => ({

        question_id: questionId,

        answer_text: a.text,

        answer_hash: hash(a.text),

        answer_order: index + 1,

        is_correct: a.correct

      })

    )

  });

};

// =======================================
// FIND EXAM
// =======================================

export const findById = async (
  examId: number
) => {

  const exam = await prisma.exam.findUnique({

    where: {
      exam_id: examId
    },

    include: {

      subject: true,

      topic: true,

      teacher: true,

      exam_questions: {

        orderBy: {
          question_order: "asc"
        },

        include: {

          question: {

            include: {

              answers: {

                orderBy: {
                  answer_order: "asc"
                }

              }

            }

          }

        }

      }

    }

  });

  console.log(
    JSON.stringify(exam, null, 2)
  );

  return exam;
};