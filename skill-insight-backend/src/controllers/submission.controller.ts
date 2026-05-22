import { Request, Response } from "express";

import prisma from "../lib/prisma";

import { gradeExam } from "../services/grading.service";

export const submitExam = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      assignment_id,
      student_id,
      answers
    } = req.body;

    //
    // VALIDATE
    //
    if (!assignment_id) {
      return res.status(400).json({
        success: false,
        message: "assignment_id is required"
      });
    }

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "student_id is required"
      });
    }

    //
    // GET ASSIGNMENT + EXAM
    //
    const assignment =
      await prisma.assignment.findUnique({
        where: {
          assignment_id: Number(
            assignment_id
          )
        },

        include: {
          exam: true
        }
      });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    //
    // CHECK TIME
    //
    const now = new Date();

    if (now < assignment.start_at) {
      return res.status(403).json({
        success: false,
        message:
          "Chưa tới thời gian làm bài"
      });
    }

    if (now > assignment.end_at) {
      return res.status(403).json({
        success: false,
        message:
          "Đã hết thời gian làm bài"
      });
    }

    //
    // CHECK MAX ATTEMPTS
    //
    const totalAttempts =
      await prisma.result.count({
        where: {

          assignment_id:
            Number(assignment_id),

          student_id:
            Number(student_id)
        }
      });

    if (
      totalAttempts >=
      assignment.max_attempts
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Bạn đã vượt quá số lần làm bài cho phép"
      });

    }

    //
    // GRADE EXAM
    //
    const gradingResult =
      await gradeExam(
        assignment.exam_id,
        answers
      );

    //
    // CREATE RESULT
    //
    const result =
      await prisma.result.create({
        data: {

          assignment_id:
            Number(assignment_id),

          student_id:
            Number(student_id),

          score:
            gradingResult.score,

          total_questions:
            gradingResult.totalQuestions,

          correct_answers:
            gradingResult.correctAnswers,

          status: "SUBMITTED",

          start_time:
            new Date(),

          submit_time:
            new Date(),

          attempt_no:
            totalAttempts + 1
        }
      });

    //
// SAVE STUDENT ANSWERS
//
for (
  const [
    index,
    item
  ] of gradingResult.gradedAnswers.entries()
) {

  //
  // CREATE RESULT QUESTION
  //
  const resultQuestion =
    await prisma.resultQuestion.create({
      data: {

        result_id:
          result.result_id,

        question_id:
          item.question_id,

        question_order:
          index + 1,

        points:
          typeof item.score === "number"
            ? item.score
            : 0
      }
    });

  //
  // CREATE STUDENT ANSWER
  //
  const studentAnswer =
    await prisma.studentAnswer.create({
      data: {

        result_id:
          result.result_id,

        result_question_id:
          resultQuestion.result_question_id,

        question_id:
          item.question_id,

        essay_answer:
          item.essay_answer || null,

        is_correct:
          typeof item.is_correct === "boolean"
            ? item.is_correct
            : null,

        score:
          typeof item.score === "number"
            ? item.score
            : null,

        time_spent:
          typeof item.time_spent === "number"
            ? item.time_spent
            : null
      }
    });

  //
  // SAVE SELECTED OPTIONS
  //
  if (
    item.selected_options &&
    Array.isArray(
      item.selected_options
    ) &&
    item.selected_options.length > 0
  ) {

    await prisma.studentAnswerOption.createMany({
      data:
        item.selected_options.map(
          (
            answerId: number
          ) => ({

            student_answer_id:
              studentAnswer.student_answer_id,

            answer_id:
              answerId
          })
        )
    });

  }

}

    //
    // RESPONSE
    //
    return res.status(201).json({
      success: true,

      message:
        "Nộp bài thành công",

      data: result
    });

  } catch (error: any) {

    console.error(
      "SUBMIT EXAM ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Lỗi server"
    });

  }

};