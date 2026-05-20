import prisma from "../lib/prisma";

export const submit = async (
  data: any
) => {

  /**
   * GET EXAM
   */
  const exam =
    await prisma.exam.findUnique({

      where: {
        exam_id: Number(data.examId),
      },

      include: {

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

  if (!exam) {

    throw new Error(
      "Không tìm thấy đề thi"
    );

  }

  /**
   * CALCULATE SCORE
   */
  let correct = 0;

  const studentAnswers: any[] = [];

  for (const eq of exam.exam_questions) {

    const question =
      eq.question;

    const selectedAnswerId =
      data.answers[
        question.question_id
      ];

    const correctAnswer =
      question.answers.find(
        (a) => a.is_correct
      );

    const isCorrect =
      correctAnswer?.answer_id ===
      selectedAnswerId;

    if (isCorrect) {
      correct++;
    }

    studentAnswers.push({

      question_id:
        question.question_id,

      selected_option_id:
        selectedAnswerId,

      is_correct:
        isCorrect,

    });

  }

  /**
   * SCORE
   */
  const score =
    (correct /
      exam.exam_questions.length) *
    10;

  /**
   * CREATE RESULT
   */
  const result =
    await prisma.result.create({

      data: {

        student_id:
          Number(data.userId),

        exam_id:
          Number(data.examId),

        score,

        total_questions:
          exam.exam_questions.length,

        correct_answers:
          correct,

        status: "SUBMITTED",

        start_time:
          new Date(),

        submit_time:
          new Date(),

      },

    });

  /**
   * SAVE STUDENT ANSWERS
   */
  for (const item of studentAnswers) {

    await prisma.studentAnswer.create({

      data: {

        result_id:
          result.result_id,

        question_id:
          item.question_id,

        selected_option_id:
          item.selected_option_id,

        is_correct:
          item.is_correct,

      },

    });

  }

  return {

    result,

    score,

    correct_answers: correct,

    total_questions:
      exam.exam_questions.length,

  };

};