import { Request, Response } from 'express';

import prisma from '../lib/prisma';

import XLSX from "xlsx";
import crypto from "crypto";

import * as examService from "../services/exam.service";

const examInclude = {

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

};

export const getMyExams = async (
  req: Request,
  res: Response
) => {

  try {

    const teacherId =
      Number((req as any).user.userId);

    const exams =
      await prisma.exam.findMany({

        where: {

          teacher_id: teacherId,

          deleted_at: null

        },

        include: examInclude,

        orderBy: {

          created_at: "desc"

        }

      });

    return res.json({

      success: true,

      data: exams

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Load my exams failed"

    });

  }

};

export const getSystemExams = async (
  req: Request,
  res: Response
) => {

  try {

    const exams =
      await prisma.exam.findMany({

        where: {

          deleted_at: null,

          visibility: "SYSTEM_BANK",

          status_exam: "APPROVED"

        },

        include: examInclude,

        orderBy: {

          created_at: "desc"

        }

      });

    return res.json({

      success: true,

      data: exams

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Load system exams failed"

    });

  }

};

export const getTeacherExams = async (
  req: Request,
  res: Response
) => {

  try {

    const exams =
      await prisma.exam.findMany({

        where: {

          deleted_at: null,

          source: "TEACHER",

          allow_system_integration: true,

          status_exam: {

            in: [

              "PENDING",

              "APPROVED",

              "REJECTED"

            ]

          }

        },

        include: examInclude,

        orderBy: [

          {

            status_exam: "asc"

          },

          {

            created_at: "desc"

          }

        ]

      });

    return res.json({

      success: true,

      data: exams

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Load teacher exams failed"

    });

  }

};

export const getAllExams = async (
  req: Request,
  res: Response
) => {

  try {

    const exams =
      await prisma.exam.findMany({

        where: {

          deleted_at: null,

          OR: [

           {
              // Đề giáo viên gửi duyệt / đã duyệt
              source: "TEACHER",

              status_exam: {
                  in: [
                      "PENDING",
                      "APPROVED"
                  ]
              },

              allow_system_integration: true
          },


            // Đề hệ thống
            {
              source: "SYSTEM",

              visibility: "SYSTEM_BANK",

              status_exam: "APPROVED"
            }

          ]

        },

        include: examInclude,

        orderBy: [

          {
            allow_system_integration: "desc"
          },

          {
            created_at: "desc"
          }

        ]

      });


    return res.json({

      success: true,

      data: exams

    });


  } catch(error:any){

    console.error(error);

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

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

  try {

    const {
      title,
      subject_id
    } = req.body;

    const user = (req as any).user;

    const teacherId = Number(user.userId);

    const role = user.role;

    // =========================
    // VALIDATE
    // =========================

    if (!title?.trim()) {

      return res.status(400).json({

        success: false,

        message: "Thiếu title"

      });

    }

    if (!subject_id) {

      return res.status(400).json({

        success: false,

        message: "Thiếu subject_id"

      });

    }

    if (!teacherId) {

      return res.status(400).json({

        success: false,

        message: "Thiếu teacher_id"

      });

    }

    // =========================
    // CHECK USER
    // =========================

    const teacher = await prisma.user.findUnique({

      where: {

        user_id: teacherId

      }

    });

    if (!teacher) {

      return res.status(400).json({

        success: false,

        message: `User không tồn tại: ${teacherId}`

      });

    }
    console.log(req.body);
    console.log(req.file);

    // =========================
    // CREATE EXAM
    // =========================

    const exam = await examService.createExam({
      ...req.body,
      file: req.file,          // <-- thêm dòng này
      teacher_id: teacherId,
      role
    });

    return res.status(201).json({

      success: true,

      data: exam
    });

  } catch (error: any) {

    console.error("CREATE EXAM ERROR:", error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// =========================
// INTEGRATE EXAM
// =========================
export const integrateExam = async (
  req: Request,
  res: Response
) => {

  try {

    const examId = Number(req.params.id);

    const teacherId =
      Number((req as any).user.userId);


    const exam =
      await prisma.exam.findUnique({

        where: {
          exam_id: examId
        }

      });


    if (!exam) {

      return res.status(404).json({

        success: false,

        message: "Không tìm thấy đề"

      });

    }


    if (exam.teacher_id !== teacherId) {

      return res.status(403).json({

        success: false,

        message: "Không có quyền"

      });

    }


    if (exam.is_copy) {

      return res.status(400).json({

        success:false,

        message:"Không thể tích hợp đề sao chép"

      });

    }


    await prisma.exam.update({

      where:{
        exam_id: examId
      },

      data:{

        allow_system_integration:true,

        visibility:"PUBLIC",

        status_exam:"PENDING"

      }

    });


    return res.json({

      success:true,

      message:"Đã gửi yêu cầu tích hợp"

    });


  } catch(error:any){

    console.error(error);

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

// =========================
// APPROVE EXAM
// =========================
export const approveExam = async (
  req: Request,
  res: Response
) => {

  try {

    const examId =
      Number(req.params.id);


    const adminId =
      Number((req as any).user.userId);



    await prisma.exam.update({

      where:{

        exam_id: examId

      },


      data:{

        // giữ nguyên nguồn giáo viên
        source:"TEACHER",

        // cho giáo viên khác thấy
        visibility:"PUBLIC",

        // đã duyệt
        status_exam:"APPROVED",

        approved_by:adminId,

        approved_at:new Date()

      }

    });


    return res.json({

      success:true,

      message:"Đã duyệt đề"

    });


  } catch(error:any){

    console.error(error);


    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

// =========================
// REJECT EXAM
// =========================
export const rejectExam = async (
  req: Request,
  res: Response
) => {

  try {

    const examId =
      Number(req.params.id);

    const {
      reason
    } = req.body;

    await prisma.exam.update({

      where: {

        exam_id: examId

      },

      data: {

        // Bị từ chối
        status_exam: "REJECTED",

        // Trả về riêng tư cho giáo viên
        visibility: "PRIVATE",

        // Giữ nguyên nguồn
        source: "TEACHER",

        rejected_reason: reason

      }

    });

    return res.json({

      success: true,

      message: "Đã từ chối"

    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

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

export const copyExam = async (
  req: Request,
  res: Response
) => {

  try {

    const examId = Number(req.params.id);

    const teacherId =
      Number((req as any).user.userId);


    // =====================================
    // Lấy đề gốc
    // =====================================

    const exam =
      await prisma.exam.findUnique({

        where: {
          exam_id: examId
        },

        include: {

          exam_questions: true

        }

      });


    if (!exam) {

      return res.status(404).json({

        success: false,

        message: "Không tìm thấy đề."

      });

    }



    // =====================================
    // Transaction copy
    // =====================================

    const newExam =
      await prisma.$transaction(

        async (tx) => {


          const created =
            await tx.exam.create({

              data: {

                title:
                  exam.title + " (Bản sao)",


                description:
                  exam.description,


                subject_id:
                  exam.subject_id,


                topic_id:
                  exam.topic_id,


                teacher_id:
                  teacherId,


                duration:
                  exam.duration,


                pass_score:
                  exam.pass_score,


                is_random:
                  exam.is_random,


                random_question_count:
                  exam.random_question_count,


                total_questions:
                  exam.total_questions,


                // =========================
                // COPY INFO
                // =========================

                is_copy: true,


                // =========================
                // Đề copy luôn là đề riêng
                // =========================

                source: "TEACHER",

                status_exam: "DRAFT",

                visibility: "PRIVATE",

                allow_system_integration: false

              }

            });



          // =====================================
          // Copy câu hỏi
          // =====================================

          if (
            exam.exam_questions.length > 0
          ) {


            await tx.examQuestion.createMany({

              data:

                exam.exam_questions.map(q => ({

                  exam_id:
                    created.exam_id,


                  question_id:
                    q.question_id,


                  question_order:
                    q.question_order,


                  points:
                    q.points

                }))

            });

          }


          return created;

        }

      );



    return res.json({

      success: true,

      message:
        "Sao chép đề thành công.",

      data: newExam

    });


  }

  catch (error) {

    console.error(error);


    return res.status(500).json({

      success: false,

      message:
        "Không thể sao chép đề."

    });

  }

};

// ======================================================
// UPDATE EXAM
// ======================================================

export const updateExam = async (
  req: Request,
  res: Response
) => {

  try {

    const examId = Number(req.params.id);

    const {

      title,
      description,

      subject_id,
      topic_id,

      duration,
      pass_score,

      is_random,
      random_question_count

    } = req.body;

    const exam =
      await prisma.exam.findUnique({

        where: {

          exam_id: examId

        }

      });

    if (!exam) {

      return res.status(404).json({

        success: false,

        message: "Không tìm thấy đề."

      });

    }

    const updated =
      await prisma.exam.update({

        where: {

          exam_id: examId

        },

        data: {

          title,

          description,

          subject_id:
            Number(subject_id),

          topic_id:
            topic_id
              ? Number(topic_id)
              : null,

          duration:
            Number(duration),

          pass_score:
            Number(pass_score),

          is_random:
            Boolean(is_random),

          random_question_count:
            Number(random_question_count)

        }

      });

    return res.json({

      success: true,

      message: "Cập nhật thành công.",

      data: updated

    });

  }

  catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ======================================================
// CANCEL INTEGRATE
// ======================================================

export const cancelIntegrateExam = async (
  req: Request,
  res: Response
) => {

  try {

    const examId = Number(req.params.id);

    const teacherId =
      Number((req as any).user.userId);


    const exam =
      await prisma.exam.findUnique({

        where:{
          exam_id: examId
        }

      });


    if (!exam) {

      return res.status(404).json({
        success:false,
        message:"Không tìm thấy đề"
      });

    }


    if (exam.teacher_id !== teacherId) {

      return res.status(403).json({
        success:false,
        message:"Không có quyền"
      });

    }


    if (exam.status_exam !== "PENDING") {

      return res.status(400).json({
        success:false,
        message:"Đề không ở trạng thái chờ duyệt"
      });

    }


    await prisma.exam.update({

      where:{
        exam_id: examId
      },

      data:{

        status_exam:"DRAFT",

        allow_system_integration:false

      }

    });


    return res.json({

      success:true,

      message:"Đã hủy yêu cầu tích hợp"

    });


  } catch(error:any){

    console.error(error);

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

// ======================================================
// CREATE SUBJECT
// ======================================================

export const createSubject = async (

  req: Request,

  res: Response

) => {

  try {

    const {

      subject_name,

      description

    } = req.body;

    const userId =
      Number((req as any).user.userId);

    const existed =
      await prisma.subject.findUnique({

        where: {

          subject_name

        }

      });

    if (existed) {

      return res.status(400).json({

        success: false,

        message: "Môn học đã tồn tại."

      });

    }

    const subject =
      await prisma.subject.create({

        data: {

          subject_name,

          description,

          created_by: userId

        }

      });

    return res.status(201).json({

      success: true,

      data: subject

    });

  }

  catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ======================================================
// CREATE TOPIC
// ======================================================

export const createTopic = async (

  req: Request,

  res: Response

) => {

  try {

    const {

      topic_name,

      description,

      subject_id

    } = req.body;

    const userId =
      Number((req as any).user.userId);

    const existed =
      await prisma.topic.findFirst({

        where: {

          topic_name,

          subject_id:
            Number(subject_id)

        }

      });

    if (existed) {

      return res.status(400).json({

        success: false,

        message: "Chủ đề đã tồn tại."

      });

    }

    const topic =
      await prisma.topic.create({

        data: {

          topic_name,

          description,

          subject_id:
            Number(subject_id),

          creator_id:
            userId

        }

      });

    return res.status(201).json({

      success: true,

      data: topic

    });

  }

  catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ======================================================
// REMOVE QUESTION FROM EXAM
// ======================================================

export const removeQuestionFromExam = async (
  req: Request,
  res: Response
) => {

  try {

    const examId =
      Number(req.params.examId);

    const questionId =
      Number(req.params.questionId);

    const examQuestion =
      await prisma.examQuestion.findFirst({

        where: {

          exam_id: examId,

          question_id: questionId

        }

      });

    if (!examQuestion) {

      return res.status(404).json({

        success: false,

        message: "Không tìm thấy câu hỏi."

      });

    }

    await prisma.examQuestion.delete({

      where: {

        exam_question_id:
          examQuestion.exam_question_id

      }

    });

    // ==========================
    // Sắp xếp lại thứ tự
    // ==========================

    const questions =
      await prisma.examQuestion.findMany({

        where: {

          exam_id: examId

        },

        orderBy: {

          question_order: "asc"

        }

      });

    for (

      let i = 0;

      i < questions.length;

      i++

    ) {

      await prisma.examQuestion.update({

        where: {

          exam_question_id:
            questions[i].exam_question_id

        },

        data: {

          question_order: i + 1

        }

      });

    }

    await prisma.exam.update({

      where: {

        exam_id: examId

      },

      data: {

        total_questions:
          questions.length

      }

    });

    return res.json({

      success: true,

      message:
        "Đã xóa câu hỏi."

    });

  }

  catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ======================================================
// SHUFFLE QUESTIONS
// ======================================================

export const shuffleExamQuestions = async (
  req: Request,
  res: Response
) => {

  try {

    const examId =
      Number(req.params.examId);

    const {

      questionCount

    } = req.body;

    const exam =
      await prisma.exam.findUnique({

        where: {

          exam_id: examId

        }

      });

    if (!exam) {

      return res.status(404).json({

        success: false,

        message:
          "Không tìm thấy đề."

      });

    }

    // ==========================
    // Lấy ngẫu nhiên câu hỏi
    // ==========================

    const questions =
      await prisma.question.findMany({

        where: {

          subject_id:
            exam.subject_id,

          topic_id:
            exam.topic_id,

          deleted_at: null,

          is_active: true

        }

      });

    if (

      questions.length === 0

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Không có câu hỏi."

      });

    }

    // ==========================
    // Shuffle
    // ==========================

    const shuffled =
      [...questions].sort(

        () => Math.random() - 0.5

      );

    const selected =
      shuffled.slice(

        0,

        Number(questionCount)

      );

    // ==========================
    // Xóa câu cũ
    // ==========================

    await prisma.examQuestion.deleteMany({

      where: {

        exam_id: examId

      }

    });

    // ==========================
    // Thêm câu mới
    // ==========================

    if (selected.length > 0) {

      await prisma.examQuestion.createMany({

        data:

          selected.map(

            (

              question,

              index

            ) => ({

              exam_id:
                examId,

              question_id:
                question.question_id,

              question_order:
                index + 1,

              points:
                question.points

            })

          )

      });

    }

    await prisma.exam.update({

      where: {

        exam_id: examId

      },

      data: {

        is_random: true,

        random_question_count:
          selected.length,

        total_questions:
          selected.length

      }

    });

    return res.json({

      success: true,

      message:
        "Đã trộn đề.",

      total:
        selected.length

    });

  }

  catch (error: any) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

export const importExamExcel = async (

  req: Request,

  res: Response

) => {

  try {

    const examId = Number(req.body.examId);

    if (!req.file) {

      return res.status(400).json({

        success: false,

        message: "Chưa chọn file Excel."

      });

    }

    // =====================================
    // Đọc file Excel
    // =====================================

    const workbook = XLSX.read(

      req.file.buffer,

      {

        type: "buffer"

      }

    );

    const sheet =

      workbook.Sheets[

        workbook.SheetNames[0]

      ];

    const rows =

      XLSX.utils.sheet_to_json<any>(

        sheet

      );
     
      console.log(rows);
      console.log(rows[0]);

    if (!rows.length) {

      return res.status(400).json({

        success: false,

        message: "File không có dữ liệu."

      });

    }

    // =====================================
    // Kiểm tra đề
    // =====================================

    const exam =

      await prisma.exam.findUnique({

        where: {

          exam_id: examId

        }

      });

    if (!exam) {

      return res.status(404).json({

        success: false,

        message: "Không tìm thấy đề."

      });

    }

    const importedQuestions: any[] = [];

    for (const row of rows) {

      const content =

        String(

          row.question || ""

        ).trim();

      if (!content) {

        continue;

      }

      const optionA =

        String(

          row.option_a || ""

        ).trim();

      const optionB =

        String(

          row.option_b || ""

        ).trim();

      const optionC =

        String(

          row.option_c || ""

        ).trim();

      const optionD =

        String(

          row.option_d || ""

        ).trim();

      const correct =

        String(

          row.correct_answer || ""

        )

          .trim()

          .toUpperCase();

      const difficulty =

        String(

          row.difficulty || "EASY"

        )

          .trim()

          .toUpperCase();

      // =====================================
      // Validate
      // =====================================

      if (

        !optionA ||

        !optionB ||

        !optionC ||

        !optionD

      ) {

        continue;

      }

      if (

        !["A", "B", "C", "D"]

          .includes(correct)

      ) {

        continue;

      }

      const hash =

        crypto

          .createHash("sha256")

          .update(content)

          .digest("hex");

      // =====================================
      // Tìm câu hỏi theo hash
      // =====================================

      const existingQuestion =

        await prisma.question.findFirst({

          where: {

            subject_id:

              exam.subject_id,

            content_hash:

              hash

          }

        });

      let question = existingQuestion;

      // =====================================
      // Nếu chưa có thì tạo mới
      // =====================================

      if (!question) {

        question =

          await prisma.question.create({

            data: {

              subject_id:

                exam.subject_id,

              topic_id:

                exam.topic_id,

              created_by:

                exam.teacher_id,

              content,

              content_hash:

                hash,

              question_type:

                "SINGLE_CHOICE",

              level:

                difficulty as any,

              visibility:

                "PRIVATE"

            }

          });

        const options = [

          optionA,

          optionB,

          optionC,

          optionD

        ];

        const labels = [

          "A",

          "B",

          "C",

          "D"

        ];

        await prisma.answer.createMany({

          data:

            options.map(

              (

                answer,

                index

              ) => ({

                question_id:

                  question!.question_id,

                answer_text:

                  answer,

                answer_hash:

                  crypto

                    .createHash("sha256")

                    .update(answer)

                    .digest("hex"),

                answer_order:

                  index + 1,

                is_correct:

                  labels[index] === correct

              })

            )

        });

      }

      // =====================================
      // Đảm bảo question luôn tồn tại
      // =====================================

      if (!question) {

        continue;

      }

      // =====================================
      // Đã có trong đề chưa?
      // =====================================

      const existed =

        await prisma.examQuestion.findFirst({

          where: {

            exam_id:

              examId,

            question_id:

              question.question_id

          }

        });

      if (existed) {

        continue;

      }

      importedQuestions.push(question);

    }

    // =====================================
    // Thêm vào ExamQuestion
    // =====================================

    const currentCount =

      await prisma.examQuestion.count({

        where: {

          exam_id: examId

        }

      });

    const examQuestions =

      importedQuestions.map(

        (

          question,

          index

        ) => ({

          exam_id:

            examId,

          question_id:

            question.question_id,

          question_order:

            currentCount +

            index +

            1,

          points:

            question.points ?? 1

        })

      );

    if (

      examQuestions.length > 0

    ) {
      console.log(examQuestions);
      await prisma.examQuestion.createMany({

        data: examQuestions

      });
      //console.log(result);
    }

    // =====================================
    // Update total_questions
    // =====================================

    const totalQuestions =

      await prisma.examQuestion.count({

        where: {

          exam_id: examId

        }

      });

    await prisma.exam.update({

      where: {

        exam_id: examId

      },

      data: {

        total_questions:

          totalQuestions

      }

    });

    return res.status(200).json({

      success: true,

      message:

        `Import thành công ${importedQuestions.length} câu hỏi.`,

      data: {

        imported:

          importedQuestions.length,

        total_questions:

          totalQuestions

      }

    });

  }

  catch (error: any) {

    console.error(

      "IMPORT EXCEL ERROR:",

      error

    );

    return res.status(500).json({

      success: false,

      message:

        error.message

    });

  }

};

