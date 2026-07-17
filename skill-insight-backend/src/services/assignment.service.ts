import * as assignmentRepo from "../repositories/assignment.repository";
import prisma from "../lib/prisma";

// ======================================
// CREATE
// ======================================

export const createAssignment = async (
  data: any
) => {

  const exam =
    await prisma.exam.findUnique({

      where: {
        exam_id: Number(data.exam_id)
      }

    });

  if (!exam) {
    throw new Error("Đề thi không tồn tại.");
  }

  return await assignmentRepo.create({

    exam_id: Number(data.exam_id),

    class_id: Number(data.class_id),

    teacher_id: Number(data.teacher_id),

    title: exam.title,

    start_at: new Date(data.start_time),

    end_at: new Date(data.end_time),

    duration:
      data.duration_override
        ? Number(data.duration_override)
        : exam.duration,

    max_attempts:
      Number(data.max_attempts),

    allow_review: true,

    show_answer: false,

    shuffle_answers:
      data.block_copy ?? true,

    shuffle_questions:
      false

  });

};

// ======================================
// GET ALL
// ======================================

export const getAssignments = async () => {

  return await assignmentRepo.findAll();

};

// ======================================
// GET DETAIL
// ======================================

export const getAssignmentById = async (
  id: number
) => {

  return await assignmentRepo.findById(id);

};

// ======================================
// DELETE
// ======================================

export const deleteAssignment = async (
  id: number
) => {

  return await assignmentRepo.deleteAssignment(id);

};

