import prisma from "../lib/prisma";

import { AppError }
from "../utils/appError";

export const subjectService = {

  // =====================================================
  // GET ALL SUBJECTS
  // =====================================================
  async getSubjects(
  page: number,
  limit: number,
  search: string
) {

  const skip = (page - 1) * limit;

  const where = search
    ? {
        subject_name: {
          contains: search
        }
      }
    : {};

  const [subjects, totalItems] =
    await prisma.$transaction([

      prisma.subject.findMany({

        where,

        skip,

        take: limit,

        orderBy: {
          created_at: "desc"
        },

        select: {

          subject_id: true,

          subject_name: true,

          description: true,

          created_at: true,

          updated_at: true,

          creator: {

            select: {

              user_id: true,

              full_name: true,

              avatar_url: true,

              role: true

            }

          }

        }

      }),

      prisma.subject.count({
        where
      })

    ]);

  return {

    subjects,

    pagination: {

      totalItems,

      totalPages:
        Math.ceil(totalItems / limit),

      currentPage: page,

      limit

    }

  };

},

async getAllSubjects() {

  const subjects =
    await prisma.subject.findMany({

      orderBy: {
        created_at: 'desc'
      },

      select: {

        subject_id: true,

        subject_name: true,

        description: true

      }

    });

  return {
    subjects
  };

},

async getSubjectsByCreator(
  creatorId: number,
  page: number,
  limit: number,
  search: string
) {
  const skip = (page - 1) * limit;

  const where = {
    created_by: creatorId,
    ...(search
      ? {
          subject_name: {
            contains: search,
          },
        }
      : {}),
  };

  const [subjects, totalItems] = await Promise.all([
    prisma.subject.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        creator: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            avatar_url: true,
            role: true,
          },
        },
      }
    }),
    prisma.subject.count({ where }),
  ]);

  return {
    subjects,
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    },
  };
},

  // =====================================================
  // FIND BY ID
  // =====================================================
  async findById(id: number) {
    const subject = await prisma.subject.findUnique({
      where: { subject_id: id },
      include: {
        creator: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            avatar_url: true,
            role: true,
          },
        },
      },
    });

    if (!subject) {
      throw new AppError("Không tìm thấy môn học", 404);
    }

    return subject;
  },

  // =====================================================
  // CREATE SUBJECT
  // =====================================================
  async createSubject(
    data: {
      subject_name: string;
      description?: string;
      created_by: number;
    }
  ) {

    const existing = await prisma.subject.findFirst({
      where: {
        subject_name: data.subject_name,
      },
    });

    if (existing) {
      throw new AppError("Tên môn học đã tồn tại", 409);
    }

    return prisma.subject.create({
      data: {
        subject_name: data.subject_name,
        description: data.description,
        created_by: data.created_by, 
      },
    });
  },

  async createBulk(
  subjects: any[],
  created_by: number
) {

  return await prisma.subject.createMany({

    data: subjects.map((s) => ({

      subject_name: s.subject_name,

      description: s.description,

      created_by

    }))

  });

},

  async updateSubject(
    id: number,
    data: {
      subject_name?: string;
      description?: string;
    }
  ) {

    const subject =
      await prisma.subject.findUnique({
        where: {
          subject_id: id,
        },
      });

    if (!subject) {

      throw new AppError(
        "Không tìm thấy môn học",
        404
      );
    }

    // check duplicate name
    if (data.subject_name) {

      const existing =
        await prisma.subject.findFirst({
          where: {
            subject_name:
              data.subject_name,

            NOT: {
              subject_id: id,
            },
          },
        });

      if (existing) {

        throw new AppError(
          "Tên môn học đã tồn tại",
          409
        );
      }
    }

    return prisma.subject.update({
      where: {
        subject_id: id,
      },

      data,
    });
  },

  // =====================================================
  // DELETE SUBJECT
  // =====================================================
  async deleteSubject(id: number) {

    const subject =
      await prisma.subject.findUnique({
        where: {
          subject_id: id,
        },
      });

    if (!subject) {

      throw new AppError(
        "Không tìm thấy môn học",
        404
      );
    }

    return prisma.subject.delete({
      where: {
        subject_id: id,
      },
    });
  },  

    // =====================================================
  // DELETE MULTIPLE SUBJECTS
  // =====================================================
  async deleteMultipleSubjects(ids: number[], userId: number, role: string) {
    if (!ids || ids.length === 0) {
      throw new AppError("Danh sách ID không hợp lệ", 400);
    }

    const where =
      role === "admin"
        ? { subject_id: { in: ids } }
        : {
            subject_id: { in: ids },
            created_by: userId,
          };

    return prisma.subject.deleteMany({ where });
  },

  // =====================================================
  // DELETE ALL SUBJECTS
  // =====================================================
  async deleteAllSubjects(role: string) {
    if (role !== "admin") {
      throw new AppError("Chỉ admin được xóa toàn bộ môn học", 403);
    }

    return prisma.subject.deleteMany({});
  },
};
