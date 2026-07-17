import { Request, Response } from "express";
import prisma from "../lib/prisma";
import crypto from "crypto";

// ======================================================
// HASH
// ======================================================

const generateHash = (text: string = "") => {
  return crypto
    .createHash("sha256")
    .update(String(text).trim())
    .digest("hex");
};

// ======================================================
// CREATE QUESTION
// ======================================================

export const createQuestion = async (
  req: Request,
  res: Response
) => {
  console.log("REQ USER:", (req as any).user);
  console.log("REQ BODY:", req.body);

  try {
    const {
      topic_id,
      subject_id,
      content,
      level,
      question_type,
      explanation,
      answers,
      visibility,
    } = req.body;

    // NEW
    const created_by = Number(
      (req as any).user?.userId
    );

    if (!created_by) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      !topic_id ||
      !subject_id ||
      !content
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const topic = await prisma.topic.findUnique({
      where: {
        topic_id: Number(topic_id),
      },
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    const content_hash =
      generateHash(content);

    const question =
      await prisma.question.create({
        data: {
          content,
          content_hash,

          level:
            (
              level || "EASY"
            ).toUpperCase() as any,

          question_type:
            question_type ||
            "SINGLE_CHOICE",

          explanation:
            explanation || "",

          visibility:
            visibility === "SYSTEM_BANK"
              ? "SYSTEM_BANK"
              : "PRIVATE",

          is_active: true,

          allow_ai_training: false,

          // ======================================================
          // FOREIGN KEYS
          // ======================================================

          created_by: created_by,

          subject_id: Number(subject_id),

          topic_id: Number(topic_id),

          // ======================================================
          // ANSWERS
          // ======================================================

          answers: {
            create: (answers || []).map(
              (
                a: any,
                index: number
              ) => {
                const answerText =
                  (
                    a.answer_text ||
                    a.content ||
                    ""
                  ).trim();

                return {
                  answer_text:
                    answerText,

                  answer_hash:
                    generateHash(
                      answerText
                    ),

                  answer_order:
                    index + 1,

                  is_correct:
                    Boolean(
                      a.is_correct
                    ),
                };
              }
            ),
          },
        },

        include: {
          answers: true,

          topic: true,

          subject: true,

          creator: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
            },
          },
        },
      });

    return res.status(201).json({
      success: true,

      message:
        "Question created successfully",

      data: question,
    });
  } catch (error: any) {
    console.error(
      "CREATE QUESTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET QUESTIONS
// ======================================================

export const getQuestions = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      topic,
      level,
      created_by,
      visibility,
    } = req.query;

    // FIX
    const currentUserId = Number(
      (req as any).user?.userId
    );

    const questions =
      await prisma.question.findMany({
        where: {
          is_active: true,

          // FILTERS
          topic_id: topic
            ? Number(topic)
            : undefined,

          level: level
            ? (String(level).toUpperCase() as any)
            : undefined,

          // ======================================================
          // SECURITY LOGIC
          // ======================================================

          AND: [
            // FILTER creator nếu client truyền
            created_by
              ? {
                  created_by:
                    Number(
                      created_by
                    ),
                }
              : {},

            // FILTER visibility nếu client truyền
            visibility
              ? {
                  visibility:
                    String(
                      visibility
                    ) as any,
                }
              : {},

            // LOGIC CHÍNH
            {
              OR: [
                // KHO HỆ THỐNG
                {
                  visibility:
                    "SYSTEM_BANK",
                },

                // KHO RIÊNG CỦA USER
                {
                  AND: [
                    {
                      visibility:
                        "PRIVATE",
                    },
                    {
                      created_by:
                        currentUserId,
                    },
                  ],
                },

                // GIỮ LOGIC BATCH APPROVED
                {
                  batches: {
                    some: {
                      batch: {
                        status:
                          "APPROVED",
                      },
                    },
                  },
                },
              ],
            },
          ],
        },

        include: {
          answers: true,

          topic: true,

          subject: true,

          creator: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
            },
          },

          batches: {
            include: {
              batch: true,
            },
          },
        },

        orderBy: {
          created_at: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error: any) {
    console.error(
      "GET QUESTIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET QUESTION DETAIL
// ======================================================

export const getQuestionDetail =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(
        req.params.id
      );

      const question =
        await prisma.question.findUnique({
          where: {
            question_id: id,
          },

          include: {
            answers: true,

            topic: true,

            subject: true,

            creator: {
              select: {
                user_id: true,
                full_name: true,
                email: true,
              },
            },

            batches: {
              include: {
                batch: true,
              },
            },
          },
        });

      if (!question) {
        return res.status(404).json({
          success: false,
          message:
            "Question not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: question,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================================
// UPDATE QUESTION
// ======================================================

export const updateQuestion = async (
    req: Request,
    res: Response
  ) => {
    try {

      const id = Number(req.params.id);

      const {
        content,
        explanation,
        level,
        question_type,
        visibility,
        is_active,
        answers
      } = req.body;

      const oldQuestion = await prisma.question.findUnique({

        where: {
          question_id: id
        }

      });

      if (!oldQuestion) {

        return res.status(404).json({

          success: false,
          message: "Question not found"

        });

      }

      const question = await prisma.question.update({

        where: {
          question_id: id
        },

        data: {

          content,

          content_hash: generateHash(content),

          explanation,

          level,

          question_type,

          visibility,

          is_active,

          answers: {

            deleteMany: {},

            create: (answers || []).map((a: any) => ({

              answer_text: a.answer_text,

              answer_hash: generateHash(a.answer_text),

              answer_order: a.answer_order,

              is_correct: a.is_correct

            }))

          }

        },

        include: {

          answers: true,

          subject: true,

          topic: true,

          creator: true

        }

      });

      return res.json({

        success: true,

        data: question

      });

    }

    catch (err: any) {

      console.error(err);

      return res.status(500).json({

        success: false,

        message: err.message

      });

    }

  };

// ======================================================
// DELETE QUESTION
// ======================================================

export const deleteQuestion =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(
        req.params.id
      );

      const role =
        (req as any).user?.role ||
        "teacher";

      const isAdmin =
        role === "admin";

      const existingQuestion =
        await prisma.question.findUnique({
          where: {
            question_id: id,
          },
        });

      if (!existingQuestion) {
        return res.status(404).json({
          success: false,

          message:
            "Question not found",
        });
      }

      // ======================================================
      // CHECK OWNER
      // ======================================================

      if (
        !isAdmin &&
        existingQuestion.created_by !==
          Number(
            (req as any).user
              ?.userId
          )
      ) {
        return res.status(403).json({
          success: false,

          message:
            "Bạn không có quyền xoá câu hỏi này",
        });
      }

      // delete batch relation

      await prisma.questionBatchQuestion.deleteMany(
        {
          where: {
            question_id: id,
          },
        }
      );

      // delete answers

      await prisma.answer.deleteMany({
        where: {
          question_id: id,
        },
      });

      // delete question

      await prisma.question.delete({
        where: {
          question_id: id,
        },
      });

      return res.status(200).json({
        success: true,

        message:
          "Question deleted successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };

  
// ======================================================
// GET PENDING QUESTIONS
// ======================================================

export const getPendingQuestions =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const questions =
        await prisma.question.findMany({
          where: {
            batches: {
              some: {
                batch: {
                  status:
                    "PENDING",
                },
              },
            },
          },

          include: {
            answers: true,

            topic: true,

            subject: true,

            creator: {
              select: {
                user_id: true,
                full_name: true,
                email: true,
              },
            },

            batches: {
              include: {
                batch: true,
              },
            },
          },

          orderBy: {
            created_at: "desc",
          },
        });

      return res.status(200).json({
        success: true,

        count: questions.length,

        data: questions,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };

  export const integrateQuestion = async (
  req: Request,
  res: Response
) => {

  try {

    const id =
      Number(req.params.id);

    const userId =
      Number(
        (req as any).user?.userId
      );

    const question =
      await prisma.question.findUnique({

        where: {
          question_id: id
        }

      });

    if (!question) {

      return res.status(404).json({

        success: false,
        message:
          'Không tìm thấy câu hỏi'

      });

    }

    if (
      question.created_by !== userId
    ) {

      return res.status(403).json({

        success: false,
        message:
          'Không có quyền'

      });

    }

    await prisma.question.update({

      where: {
        question_id: id
      },

      data: {

        visibility:
          'SYSTEM_BANK'

      }

    });

    return res.json({

      success: true,
      message:
        'Đã tích hợp vào hệ thống'

    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,
      message:
        error.message

    });

  }

};