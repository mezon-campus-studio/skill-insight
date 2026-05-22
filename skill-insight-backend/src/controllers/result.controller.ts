import { Request, Response } from "express";

import prisma from "../lib/prisma";

export const getResultById = async (
  req: Request,
  res: Response
) => {

  try {

    const resultId = Number(
      req.params.id
    );

    const result =
      await prisma.result.findUnique({

        where: {
          result_id: resultId,
        },

        include: {

          //
          // ASSIGNMENT
          //
          assignment: {

            include: {

              //
              // EXAM INFO
              //
              exam: true,

              //
              // CLASS INFO
              //
              class: true,

              //
              // TEACHER
              //
              teacher: {
                select: {
                  user_id: true,
                  full_name: true,
                  email: true,
                },
              },

            },

          },

          //
          // STUDENT
          //
          student: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
              avatar_url: true,
            },
          },

          //
          // STUDENT ANSWERS
          //
          student_answers: {

            include: {

              //
              // QUESTION
              //
              question: {

                include: {

                  //
                  // REAL ANSWERS
                  //
                  answers: true,

                  //
                  // TOPIC
                  //
                  topic: true,

                  //
                  // SUBJECT
                  //
                  subject: true,

                },

              },

              //
              // SELECTED OPTIONS
              //
              selected_options: {

                include: {

                  //
                  // REAL ANSWER DATA
                  //
                  answer: true,

                },

              },

            },

          },

        },

      });

    if (!result) {

      return res.status(404).json({
        success: false,
        message:
          "Không tìm thấy kết quả",
      });

    }

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    console.error(
      "GET RESULT DETAIL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Lỗi server",
    });

  }

};