import prisma from "../lib/prisma";

export const gradeExam = async (
  examId: number,
  answers: any[]
) => {

  let correctAnswers = 0;

  const gradedAnswers = [];

  for (const item of answers) {

    const question = await prisma.question.findUnique({
      where: {
        question_id: item.question_id
      },
      include: {
        answers: true
      }
    });

    if (!question) continue;

    //
    // GET CORRECT ANSWERS
    //
    const correctAnswersList = question.answers
      .filter((a) => a.is_correct)
      .map((a) => a.answer_id)
      .sort();

    //
    // USER SELECTED OPTIONS
    //
    const selectedOptions = (
      item.selected_options || []
    ).sort();

    //
    // CHECK QUESTION TYPE
    //
    let isCorrect = false;

    //
    // SINGLE CHOICE / TRUE FALSE
    //
    if (
      question.question_type === "SINGLE_CHOICE" ||
      question.question_type === "TRUE_FALSE"
    ) {

      isCorrect =
        selectedOptions.length === 1 &&
        correctAnswersList.length === 1 &&
        selectedOptions[0] === correctAnswersList[0];

    }

    //
    // MULTIPLE CHOICE
    //
    else if (
      question.question_type === "MULTIPLE_CHOICE"
    ) {

      isCorrect =
        JSON.stringify(selectedOptions) ===
        JSON.stringify(correctAnswersList);

    }

    //
    // ESSAY
    //
    else if (
      question.question_type === "ESSAY"
    ) {

      //
      // TODO:
      // AI grading / manual grading later
      //
      isCorrect = false;

    }

    //
    // COUNT CORRECT
    //
    if (isCorrect) {
      correctAnswers++;
    }

    //
    // SAVE GRADED ANSWER
    //
    gradedAnswers.push({

      question_id: item.question_id,

      selected_options:
        item.selected_options || [],

      essay_answer:
        item.essay_answer || null,

      is_correct: isCorrect,

      score: isCorrect ? 1 : 0,

      time_spent:
        item.time_spent || null

    });

  }

  //
  // FINAL SCORE
  //
  const totalQuestions = answers.length;

  const score =
    totalQuestions > 0
      ? (correctAnswers / totalQuestions) * 10
      : 0;

  return {
    score,
    totalQuestions,
    correctAnswers,
    gradedAnswers
  };

};