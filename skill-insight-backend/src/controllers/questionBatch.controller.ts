import { Request, Response } from "express";

import prisma from "../lib/prisma";

import * as XLSX from "xlsx";

import crypto from "crypto";

import {
  QuestionLevel
} from "@prisma/client";

// ======================================================
// HASH
// ======================================================

const generateHash = (
  text: string = ""
) => {

  return crypto
    .createHash("sha256")
    .update(
      String(text).trim()
    )
    .digest("hex");

};

// ======================================================
// UPDATE BATCH STATS
// ======================================================

const updateBatchStats = async (
  batch_id: number
) => {

  const questions =
    await prisma.questionBatchQuestion.findMany({

      where: { batch_id },

      include: {
        question: true
      }

    });

  const total =
    questions.length;

  const easy =
    questions.filter(
      q => q.question?.level === "EASY"
    ).length;

  const medium =
    questions.filter(
      q => q.question?.level === "MEDIUM"
    ).length;

  const hard =
    questions.filter(
      q => q.question?.level === "HARD"
    ).length;

  await prisma.questionBatch.update({

    where: { batch_id },

    data: {

      total_questions: total,

      easy_count: easy,

      medium_count: medium,

      hard_count: hard

    }

  });

};

// ======================================================
// CREATE QUESTION BATCH
// ======================================================

export const createQuestionBatch = async (
  req: Request,
  res: Response
) => {

  try {

    const {

  batch_name,
  description,

  subject_id,
  topic_id,

  manualSubject,
  manualTopic,

  subject_name,
  topic_name,

  questions

} = req.body;

    const teacher_id =
      Number((req as any).user?.userId);

    if (!teacher_id) {

      return res.status(401).json({

        success: false,
        message: "Unauthorized"

      });

    }

    // ======================================================
    // SUBJECT
    // ======================================================

    let finalSubjectId =
      Number(subject_id) || 0;

    const subjectText =
  String(
    manualSubject ||
    subject_name ||
    ''
  ).trim();

if (
  !finalSubjectId &&
  subjectText
) {

      let subject =
        await prisma.subject.findFirst({

          where: {

            subject_name: subjectText

          }

        });

      if (!subject) {

        subject = await prisma.subject.create({
  data: {
    subject_name:
  subjectText,
    created_by: teacher_id
  }
});

      }

      finalSubjectId =
        subject.subject_id;

    }

    // ======================================================
    // TOPIC
    // ======================================================

    let finalTopicId =
      Number(topic_id) || 0;

    const topicText =
  String(
    manualTopic ||
    topic_name ||
    ''
  ).trim();

if (
  !finalTopicId &&
  topicText
) {

      let topic =
        await prisma.topic.findFirst({

          where: {

            topic_name: topicText

          }

        });

      if (!topic) {

        topic =
          await prisma.topic.create({

            data: {

              topic_name:
                topicText,

              subject_id:
                finalSubjectId,

              creator_id: teacher_id

            }

          });

      }

      finalTopicId =
        topic.topic_id;

    }

    // ======================================================
    // VALIDATE
    // ======================================================

    if (
      !batch_name ||
      !finalSubjectId ||
      !finalTopicId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Thiếu thông tin bộ câu hỏi"

      });

    }

    // ======================================================
// CREATE BATCH
// ======================================================

const user =
  (req as any).user;

const isAdmin =
  String(
    user?.role || ''
  ).toLowerCase() === 'admin';

const batch =
  await prisma.questionBatch.create({

    data: {

      batch_code:
        `BATCH-${Date.now()}`,

      batch_name,

      description,

      teacher_id,

      subject_id:
        finalSubjectId,

      topic_id:
        finalTopicId,

      status:
        isAdmin
          ? 'APPROVED'
          : 'PENDING',

      approved_by:
        isAdmin
          ? teacher_id
          : null,

      approved_at:
        isAdmin
          ? new Date()
          : null

    }

  });
    // ======================================================
    // CREATE QUESTIONS
    // ======================================================
  let createdQuestionCount = 0;

let duplicateQuestionCount = 0;

    if (
      Array.isArray(questions) &&
      questions.length
    ) {

      let order = 1;

      for (const item of questions) {

        const content =
          String(
            item.question_text || ''
          ).trim();

        const answerA =
          String(
            item.option_a || ''
          ).trim();

        const answerB =
          String(
            item.option_b || ''
          ).trim();

        const answerC =
          String(
            item.option_c || ''
          ).trim();

        const answerD =
          String(
            item.option_d || ''
          ).trim();

        if (
          !content ||
          !answerA ||
          !answerB ||
          !answerC ||
          !answerD
        ) {
          continue;
        }

        // duplicate
        const existed =
          await prisma.question.findFirst({

            where: {

              content_hash:
                generateHash(content)

            }

          });

        if (existed) {

          duplicateQuestionCount++;

          console.log(
            'QUESTION DUPLICATE:',
            content
          );

          continue;

        }

        const level =
          (
            String(
              item.difficulty || "EASY"
            ).toUpperCase()
          ) as QuestionLevel;

        const question =
          await prisma.question.create({

  data: {

    subject_id: finalSubjectId,

    topic_id: finalTopicId,

    created_by: teacher_id,

    content: content,

    content_hash: generateHash(content),

    explanation: item.explanation || "",

    level,

    question_type: "SINGLE_CHOICE",

    visibility: "PRIVATE",

    is_active: true,

    allow_ai_training: false,

    answers: {

      create: [

        {
          answer_text: answerA,

          answer_hash: generateHash(answerA),

          is_correct:
            item.correct_answer === "A"
        },

        {
          answer_text: answerB,

          answer_hash: generateHash(answerB),

          is_correct:
            item.correct_answer === "B"
        },

        {
          answer_text: answerC,

          answer_hash: generateHash(answerC),

          is_correct:
            item.correct_answer === "C"
        },

        {
          answer_text: answerD,

          answer_hash: generateHash(answerD),

          is_correct:
            item.correct_answer === "D"
        }

      ]

    }

  }

});
        await prisma.questionBatchQuestion.create({

          data: {

            batch_id:
              batch.batch_id,

            question_id:
              question.question_id,

            question_order:
              order++

          }

        });
        createdQuestionCount++;
      }

      if (createdQuestionCount === 0) {

      await prisma.questionBatch.delete({

        where: {
          batch_id: batch.batch_id
        }

      });

      return res.status(400).json({

        success: false,

        message:
          'Không có câu hỏi mới. Tất cả câu hỏi đã tồn tại.'

      });

    }

    await updateBatchStats(
      batch.batch_id
    );

    }

    return res.status(201).json({

    success: true,

    message:
      `Tạo bộ câu hỏi thành công. ` +
      `Đã thêm ${createdQuestionCount} câu hỏi mới` +
      (
        duplicateQuestionCount > 0
          ? `, bỏ qua ${duplicateQuestionCount} câu trùng`
          : ''
      ),

    created_questions:
      createdQuestionCount,

    duplicate_questions:
      duplicateQuestionCount,

    data: batch

  });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,
      message: error.message

    });

  }

};

// ======================================================
// GET ALL BATCHES
// ======================================================

export const getQuestionBatches = async (
  req: Request,
  res: Response
) => {

  try {

    const user =
      (req as any).user;

    const userId =
      Number(user?.userId);

    const role =
      String(
        user?.role || ''
      ).toLowerCase();

    let whereCondition: any = {};

    // =====================================
    // ADMIN → thấy tất cả
    // =====================================

    if (role !== 'admin') {

      whereCondition = {

        OR: [

          // batch đã duyệt
          {
            status: 'APPROVED'
          },

          // batch của chính mình
          {
            teacher_id: userId
          }

        ]

      };

    }

    const batches =
      await prisma.questionBatch.findMany({

        where:
          whereCondition,

        orderBy: {
          created_at: "desc"
        },

        include: {

          subject: true,
          topic: true,
          teacher: true,
          approver: true,

          _count: {

            select: {
              questions: true
            }

          }

        }

      });

    return res.json({

      success: true,
      data: batches

    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,
      message: error.message

    });

  }

};

// ======================================================
// GET DETAIL
// ======================================================

export const getQuestionBatchById = async (
  req: Request,
  res: Response
) => {

  try {

    const id =
      Number(req.params.id);

    const batch =
      await prisma.questionBatch.findUnique({

        where: {
          batch_id: id
        },

        include: {

          // =====================================
          // BATCH RELATIONS
          // =====================================

          subject: true,

          topic: true,

          teacher: true,

          approver: true,

          // =====================================
          // QUESTIONS IN BATCH
          // =====================================

          questions: {

            orderBy: {
              question_order: "asc"
            },

            include: {

              question: {

                include: {

                  // =========================
                  // ANSWERS
                  // =========================

                  answers: true,

                  // =========================
                  // SUBJECT
                  // =========================

                  subject: true,

                  // =========================
                  // TOPIC
                  // =========================

                  topic: true,

                  // =========================
                  // CREATOR
                  // =========================

                  creator: true

                }

              }

            }

          }

        }

      });

    // =====================================
    // NOT FOUND
    // =====================================

    if (!batch) {

      return res.status(404).json({

        success: false,

        message: "Batch not found"

      });

    }

    // =====================================
    // SUCCESS
    // =====================================

    return res.json({

      success: true,

      data: batch

    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ======================================================
// ADD QUESTIONS
// ======================================================

export const addQuestionsToBatch = async (
  req: Request,
  res: Response
) => {

  try {

    const batch_id =
      Number(req.params.id);

    const { question_ids } =
      req.body;

    const data =
      question_ids.map(
        (qid: number, index: number) => ({

          batch_id,

          question_id: qid,

          question_order:
            index + 1

        })
      );

    await prisma.questionBatchQuestion.createMany({

      data,

      skipDuplicates: true

    });

    await updateBatchStats(
      batch_id
    );

    return res.json({

      success: true,
      message:
        "Questions added to batch"

    });

  } catch (error: any) {

    return res.status(500).json({

      success: false,
      message: error.message

    });

  }

};

// ======================================================
// REMOVE QUESTION
// ======================================================

// ======================================================
// DELETE QUESTION COMPLETELY
// ======================================================

export const removeQuestionFromBatch = async (
  req: Request,
  res: Response
) => {
  try {

    const batch_id = Number(req.params.batchId);
    const question_id = Number(req.params.questionId);

    // ======================================================
    // CHECK BATCH EXISTS
    // ======================================================
    const batch = await prisma.questionBatch.findUnique({
      where: { batch_id }
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found"
      });
    }

    // ======================================================
    // CHECK RELATION EXISTS (IMPORTANT)
    // ======================================================
    const relation = await prisma.questionBatchQuestion.findFirst({
      where: {
        batch_id,
        question_id
      }
    });

    if (!relation) {
      return res.status(404).json({
        success: false,
        message: "Question not found in this batch"
      });
    }

    // ======================================================
    // DELETE RELATION FIRST
    // ======================================================
    await prisma.questionBatchQuestion.deleteMany({
      where: {
        batch_id,
        question_id
      }
    });

    // ======================================================
    // CHECK IF QUESTION STILL USED IN OTHER BATCHES
    // ======================================================
    const otherRelations = await prisma.questionBatchQuestion.findMany({
          where: {
            question_id
          }
        });

        // chỉ xóa nếu question thuộc batch system (an toàn hơn)
    const question = await prisma.question.findUnique({
      where: { question_id }
    });

    if (otherRelations.length === 0 && question?.visibility === "PRIVATE") {

      await prisma.answer.deleteMany({
        where: { question_id }
      });

      await prisma.question.delete({
        where: { question_id }
      });

    }
    // ======================================================
    // UPDATE BATCH STATS
    // ======================================================
    await updateBatchStats(batch_id);

    return res.json({
      success: true,
      message: "Đã xóa câu hỏi khỏi batch"
    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// APPROVE
// ======================================================

export const approveBatch = async (
  req: Request,
  res: Response
) => {

  try {

    const id =
      Number(req.params.id);

    const { user_id } =
      req.body;

    const batch =
      await prisma.questionBatch.update({

        where: {
          batch_id: id
        },

        data: {

          status: "APPROVED",

          approved_by:
            user_id,

          approved_at:
            new Date()

        }

      });
    
      // ======================================================
      // UPDATE QUESTIONS VISIBILITY
      // ======================================================

      const batchQuestions =
        await prisma.questionBatchQuestion.findMany({

          where: {
            batch_id: id
          }

        });

      const questionIds =
        batchQuestions
          .map(q => q.question_id)
          .filter(
            (id): id is number =>
              id !== null
          );

      await prisma.question.updateMany({

        where: {

          question_id: {
            in: questionIds
          }

        },

        data: {

          visibility:
            'SYSTEM_BANK'

        }

      });

    return res.json({

      success: true,
      data: batch

    });

  } catch (error: any) {

    return res.status(500).json({

      success: false,
      message: error.message

    });

  }

};

// ======================================================
// DELETE
// ======================================================

export const deleteQuestionBatch = async (
  req: Request,
  res: Response
) => {

  try {

    const id =
      Number(req.params.id);

    const user =
      (req as any).user;

    const userId =
      Number(user?.userId);

    const role =
      String(user?.role || '')
        .toLowerCase();

    // =====================================
    // FIND BATCH
    // =====================================

    const batch =
      await prisma.questionBatch.findUnique({

        where: {
          batch_id: id
        }

      });

    if (!batch) {

      return res.status(404).json({

        success: false,
        message: 'Batch không tồn tại'

      });

    }

    // =====================================
    // TEACHER KHÔNG ĐƯỢC XOÁ
    // BATCH ĐÃ DUYỆT
    // =====================================

    if (
      role !== 'admin' &&
      batch.status === 'APPROVED'
    ) {

      return res.status(403).json({

        success: false,

        message:
          'Không thể xoá bộ câu hỏi hệ thống'

      });

    }

    // =====================================
    // TEACHER CHỈ XOÁ
    // BATCH CỦA CHÍNH MÌNH
    // =====================================

    if (
      role !== 'admin' &&
      batch.teacher_id !== userId
    ) {

      return res.status(403).json({

        success: false,

        message:
          'Bạn không có quyền xoá batch này'

      });

    }

    // =====================================
    // DELETE RELATION
    // =====================================

    await prisma.questionBatchQuestion.deleteMany({

      where: {
        batch_id: id
      }

    });

    // =====================================
    // DELETE BATCH
    // =====================================

    await prisma.questionBatch.delete({

      where: {
        batch_id: id
      }

    });

    return res.json({

      success: true,
      message: 'Batch deleted'

    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,
      message: error.message

    });

  }

};

// ======================================================
// IMPORT EXCEL
// ======================================================

export const importQuestionBatchExcel = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file is required"
      });
    }

    const teacher_id = Number((req as any).user?.userId);

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "Excel file is empty"
      });
    }

    let order = 1;
    let batch: any = null;
    let createdQuestionCount = 0;
    let duplicateQuestionCount = 0;

    for (const row of rows) {
      const subjectName = String(row.subject_name || "").trim();
      const topicName = String(row.topic_name || "").trim();

      if (!subjectName || !topicName) continue;

      let subject = await prisma.subject.findFirst({
        where: { subject_name: subjectName }
      });

      if (!subject) {
        subject = await prisma.subject.create({
          data: {
            subject_name: subjectName,
            created_by: teacher_id
          }
        });
      }

      let topic = await prisma.topic.findFirst({
        where: { topic_name: topicName }
      });

      if (!topic) {
        topic = await prisma.topic.create({
          data: {
            topic_name: topicName,
            subject_id: subject.subject_id,
            creator_id: teacher_id
          }
        });
      }

      if (!batch) {
        batch = await prisma.questionBatch.create({
          data: {
            batch_code: `BATCH-${Date.now()}`,
            batch_name: row.batch_name || "Imported Batch",
            description: "Imported from Excel",
            teacher_id,
            subject_id: subject.subject_id,
            topic_id: topic.topic_id
          }
        });
      }

      const content = String(row.question_text || "").trim();
      if (!content) continue;

      const existed = await prisma.question.findFirst({
        where: { content_hash: generateHash(content) }
      });

      if (existed) {
        duplicateQuestionCount++;
        continue;
      }

      const labels = ["A", "B", "C", "D"];

      const answersRaw = [
        row.option_a,
        row.option_b,
        row.option_c,
        row.option_d
      ];

      const question = await prisma.question.create({
        data: {
          subject_id: subject.subject_id,
          topic_id: topic.topic_id,
          created_by: teacher_id,
          content,
          content_hash: generateHash(content),
          explanation: row.explanation || "",
          level: (String(row.difficulty || "EASY").toUpperCase()) as QuestionLevel,
          question_type: "SINGLE_CHOICE",
          visibility: "PRIVATE",
          is_active: true,
          allow_ai_training: false,

          answers: {
            create: ["A", "B", "C", "D"]
              .map((label, index) => ({
                text: answersRaw[index],
                label
              }))
              .filter(a => a.text)
              .map(a => ({
                answer_text: String(a.text).trim(),
                answer_hash: generateHash(String(a.text).trim()),
                is_correct: String(row.correct_answer).toUpperCase() === a.label
              }))
          }
        }
      });

      await prisma.questionBatchQuestion.create({
        data: {
          batch_id: batch.batch_id,
          question_id: question.question_id,
          question_order: order++
        }
      });

      createdQuestionCount++;
    }

    if (batch && createdQuestionCount === 0) {
      await prisma.questionBatch.delete({
        where: { batch_id: batch.batch_id }
      });

      return res.status(400).json({
        success: false,
        message: "Không có câu hỏi mới. Tất cả câu hỏi đã tồn tại."
      });
    }

    if (batch) await updateBatchStats(batch.batch_id);

    return res.status(201).json({
      success: true,
      message:
        `Import Excel thành công. Đã thêm ${createdQuestionCount} câu hỏi mới` +
        (duplicateQuestionCount ? `, bỏ qua ${duplicateQuestionCount} câu trùng` : ""),
      created_questions: createdQuestionCount,
      duplicate_questions: duplicateQuestionCount,
      data: batch
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
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
    const questionId = Number(req.params.id);

    const {
      content,
      explanation,
      level,
      answers
    } = req.body;

    const existing = await prisma.question.findUnique({
      where: { question_id: questionId }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    const newContent = typeof content === "string"
      ? content.trim()
      : existing.content;

    const newExplanation =
      typeof explanation === "string"
        ? explanation
        : existing.explanation;

    const updatedQuestion = await prisma.question.update({
      where: { question_id: questionId },
      data: {
        content: newContent,

        content_hash:
          content !== undefined && content !== null
            ? generateHash(newContent)
            : existing.content_hash,

        explanation: newExplanation,

        level: level ?? existing.level,

        answers: {
          deleteMany: {},
          create: (Array.isArray(answers) ? answers : [])
            .filter((a: any) => a?.answer_text)
            .map((a: any) => ({
              answer_text: String(a.answer_text).trim(),
              answer_hash: generateHash(String(a.answer_text).trim()),
              is_correct: !!a.is_correct
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

    const relations = await prisma.questionBatchQuestion.findMany({
      where: { question_id: questionId }
    });

    for (const rel of relations) {
      await updateBatchStats(rel.batch_id);
    }

    return res.json({
      success: true,
      message: "Cập nhật câu hỏi thành công",
      data: updatedQuestion
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ======================================================
// CREATE QUESTION IN BATCH
// ======================================================

export const createQuestionInBatch = async (
  req: Request,
  res: Response
) => {

  try {

    const batchId =
      Number(req.params.id);

    const {

      content,
      explanation,
      level,
      answers

    } = req.body;

    // =====================================
    // FIND BATCH
    // =====================================

    const batch =
      await prisma.questionBatch.findUnique({

        where: {
          batch_id: batchId
        }

      });

    if (!batch) {

      return res.status(404).json({

        success: false,

        message:
          'Batch không tồn tại'

      });

    }

    // =====================================
    // CREATE QUESTION
    // =====================================

    const question =
      await prisma.question.create({

        data: {

          subject_id:
            batch.subject_id,

          topic_id:
            batch.topic_id,

          created_by:
            batch.teacher_id,

          content,

          content_hash:
            generateHash(content),

          explanation,

          level,

          question_type:
            'SINGLE_CHOICE',

          visibility:
            'PRIVATE',

          answers: {

            create:
              (answers || []).map(
                (a: any) => ({

                  answer_text:
                    a.answer_text,

                  answer_hash:
                    generateHash(
                      a.answer_text
                    ),

                  is_correct:
                    a.is_correct

                })
              )

          }

        },

        include: {

          answers: true,

          subject: true,

          topic: true,

          creator: true

        }

      });

    // =====================================
    // ORDER
    // =====================================

    const total =
      await prisma.questionBatchQuestion.count({

        where: {
          batch_id: batchId
        }

      });

    // =====================================
    // LINK TO BATCH
    // =====================================

    await prisma.questionBatchQuestion.create({

      data: {

        batch_id:
          batchId,

        question_id:
          question.question_id,

        question_order:
          total + 1

      }

    });

    await updateBatchStats(
      batchId
    );

    return res.status(201).json({

      success: true,

      message:
        'Tạo câu hỏi thành công',

      data:
        question

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

export const updateBatchQuestions = async (req: Request, res: Response) => {
  try {
    const batchId = Number(req.params.id);
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Invalid questions"
      });
    }

    const batch = await prisma.questionBatch.findUnique({
      where: { batch_id: batchId }
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found"
      });
    }

    const results: any[] = [];

    for (const q of questions) {
      if (!q?.question_id) continue;

      const relation = await prisma.questionBatchQuestion.findFirst({
        where: {
          batch_id: batchId,
          question_id: q.question_id
        }
      });

      if (!relation) continue;

      const existing = await prisma.question.findUnique({
        where: { question_id: q.question_id }
      });

      if (!existing) continue;

      const updated = await prisma.question.update({
        where: { question_id: q.question_id },
        data: {
          content: q.content ?? existing.content,
          explanation: q.explanation ?? existing.explanation,
          level: q.level ?? existing.level,

          answers: {
            deleteMany: {},
            create: (q.answers || [])
              .filter((a: any) => a?.answer_text)
              .map((a: any) => ({
                answer_text: String(a.answer_text).trim(),
                answer_hash: generateHash(String(a.answer_text).trim()),
                is_correct: !!a.is_correct
              }))
          }
        },
        include: {
          answers: true
        }
      });

      results.push(updated);
    }

    await updateBatchStats(batchId);

    return res.json({
      success: true,
      message: "Bulk update success",
      data: results
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
