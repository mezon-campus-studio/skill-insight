import { Request, Response } from 'express';

import prisma from '../lib/prisma';

// =========================
// GET SUBJECTS
// =========================
export const getSubjects = async (
  req: Request,
  res: Response
) => {

  try {

    const subjects =
      await prisma.subject.findMany({

        orderBy: {
          subject_name: 'asc'
        }
      });

    return res.status(200).json({

      success: true,

      data: subjects
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: 'Lấy môn học thất bại'
    });
  }
};

// =========================
// GET TOPICS
// =========================
export const getTopics = async (
  req: Request,
  res: Response
) => {

  try {

    const subjectId =
      Number(req.query.subjectId);

    const topics =
      await prisma.topic.findMany({

        where: {
          subject_id: subjectId
        },

        orderBy: {
          topic_name: 'asc'
        }
      });

    return res.status(200).json({

      success: true,

      data: topics
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: 'Lấy chủ đề thất bại'
    });
  }
};

// =========================
// GET ALL EXAMS
// =========================
export const getExams = async (
  req: Request,
  res: Response
) => {

  try {

    const exams =
      await prisma.exam.findMany({

        include: {

          subject: true,

          topic: true,

          teacher: {

            select: {
              user_id: true,
              full_name: true
            }
          },

          _count: {

            select: {
              exam_questions: true
            }
          }
        },

        orderBy: {
          created_at: 'desc'
        }
      });

    return res.status(200).json({

      success: true,

      data: exams
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: 'Lấy danh sách đề thi thất bại'
    });
  }
};

// =========================
// GET EXAM BY ID
// =========================
export const getExamById = async (
  req: Request,
  res: Response
) => {

  try {

    const examId =
      Number(req.params.id);

    const exam =
      await prisma.exam.findUnique({

        where: {
          exam_id: examId
        },

        include: {

          subject: true,

          topic: true,

          teacher: {

            select: {
              user_id: true,
              full_name: true
            }
          },

          exam_questions: {

            include: {

              question: {

                include: {

                  answers: {

                    select: {

                      answer_id: true,

                      answer_text: true
                    }
                  }
                }
              }
            }
          }
        }
      });

    if (!exam) {

      return res.status(404).json({

        success: false,

        message: 'Không tìm thấy đề thi'
      });
    }

    return res.status(200).json({

      success: true,

      data: exam
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: 'Lỗi server'
    });
  }
};

// =========================
// CREATE EXAM
// =========================
export const createExam = async (
  req: Request,
  res: Response
) => {

  console.log("CONTENT-TYPE:", req.headers["content-type"]);
  console.log("BODY:", req.body);
  
  try {

    console.log('BODY:', req.body);

    const {

      title,
      description,

      subject_id,
      topic_id,

      teacher_id,

      duration,
      pass_score,

      status_exam,
      visibility,

      allow_system_integration,

      is_random,
      random_question_count

    } = req.body;

    // =========================
    // VALIDATE
    // =========================
    if (!title) {

      return res.status(400).json({

        success: false,

        message: 'Thiếu title'
      });
    }

    if (!subject_id) {

      return res.status(400).json({

        success: false,

        message: 'Thiếu subject_id'
      });
    }

    // =========================
    // CHECK TEACHER
    // =========================
    const teacher =
      await prisma.user.findUnique({

        where: {
          user_id: Number(teacher_id)
        }
      });

    if (!teacher) {

      return res.status(400).json({

        success: false,

        message:
          `Teacher không tồn tại: ${teacher_id}`
      });
    }

    // =========================
    // CREATE
    // =========================
    const exam =
      await prisma.exam.create({

        data: {

          title,

          description:
            description || null,

          subject_id:
            Number(subject_id),

          topic_id:
            topic_id
              ? Number(topic_id)
              : null,

          teacher_id:
            Number(teacher_id),

          duration:
            Number(duration),

          pass_score:
            Number(pass_score),

          status_exam,

          visibility,

          allow_system_integration:
            Boolean(
              allow_system_integration
            ),

          is_random:
            Boolean(is_random),

          random_question_count:
            Number(
              random_question_count
            ) || 0
        }
      });

    return res.status(201).json({

      success: true,

      data: exam
    });

  } catch (error: any) {

    console.error(
      'CREATE EXAM ERROR:',
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};

// =========================
// DELETE EXAM
// =========================
export const deleteExam = async (
  req: Request,
  res: Response
) => {

  try {

    const examId =
      Number(req.params.id);

    await prisma.exam.delete({

      where: {
        exam_id: examId
      }
    });

    return res.status(200).json({

      success: true,

      message:
        'Xóa đề thi thành công'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Xóa đề thi thất bại'
    });
  }
};

// =========================
// DELETE MANY EXAMS
// =========================
export const deleteManyExams = async (
  req: Request,
  res: Response
) => {

  try {

    const ids =
      req.body.ids || [];

    if (!Array.isArray(ids)) {

      return res.status(400).json({

        success: false,

        message:
          'Danh sách ids không hợp lệ'
      });
    }

    await prisma.exam.deleteMany({

      where: {

        exam_id: {
          in: ids.map(Number)
        }
      }
    });

    return res.status(200).json({

      success: true,

      message:
        'Xóa nhiều đề thi thành công'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Xóa nhiều đề thi thất bại'
    });
  }
};

// =========================
// DELETE ALL EXAMS
// =========================
export const deleteAllExams = async (
  req: Request,
  res: Response
) => {

  try {

    await prisma.exam.deleteMany();

    return res.status(200).json({

      success: true,

      message:
        'Đã xóa toàn bộ đề thi'
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        'Xóa toàn bộ đề thi thất bại'
    });
  }
};