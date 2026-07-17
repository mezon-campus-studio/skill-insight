import prisma from "../lib/prisma";

// ======================================
// CREATE
// ======================================

export const create = async (
  data: any
) => {

  return await prisma.assignment.create({

    data,

    include: {

      exam: true,

      class: true,

      teacher: {

        select: {

          user_id: true,

          full_name: true

        }

      }

    }

  });

};

// ======================================
// GET ALL
// ======================================

export const findAll = async () => {

  return await prisma.assignment.findMany({

    include: {

      exam: true,

      class: true,

      teacher: {

        select: {

          user_id: true,

          full_name: true

        }

      }

    },

    orderBy: {

      created_at: "desc"

    }

  });

};

// ======================================
// GET DETAIL
// ======================================

export const findById = async (
  id: number
) => {

  return await prisma.assignment.findUnique({

    where: {

      assignment_id: id

    },

    include: {

      exam: true,

      class: true,

      teacher: {

        select: {

          user_id: true,

          full_name: true,

          email: true

        }

      },

      assignment_questions: {

        orderBy: {

          question_order: 'asc'

        },

        include: {

          question: {

            include: {

              answers: {

                orderBy: {

                  answer_order: 'asc'

                },

                select: {

                  answer_id: true,

                  answer_text: true,

                  answer_order: true

                  // KHÔNG trả is_correct cho học sinh
                }

              }

            }

          }

        }

      },

      results: true

    }

  });

};

// ======================================
// DELETE
// ======================================

export const deleteAssignment = async (
  id: number
) => {

  return await prisma.assignment.delete({

    where: {

      assignment_id: id

    }

  });

};