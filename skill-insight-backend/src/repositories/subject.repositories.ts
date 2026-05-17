import prisma from "../lib/prisma";

export const subjectRepository = {
  // CREATE
  async create(data: any) {
    return prisma.subject.create({
      data,
    });
  },
  // FIND ALL
  async findAll() {
    return prisma.subject.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  },
  // FIND BY ID
  async findById(id: number) {
    return prisma.subject.findUnique({
      where: {
        subject_id: id,
      },
    });
  },
  // FIND DUPLICATE SUBJECT
  async findDuplicateSubject(
    subject_name: string,
    created_by: number,
    excludeId?: number,
  ) {
    return prisma.subject.findFirst({
      where: {
        subject_name,
        created_by,

        ...(excludeId && {
          NOT: {
            subject_id: excludeId,
          },
        }),
      },
    });
  },
  // UPDATE
  async update(id: number, data: any) {
    return prisma.subject.update({
      where: {
        subject_id: id,
      },
      data,
    });
  },
  // DELETE
  async delete(id: number) {
    return prisma.subject.delete({
      where: {
        subject_id: id,
      },
    });
  },
  // FIND SUBJECTS FOR TEACHER
  async findSubjectsForTeacher(teacherId: number, adminIds: number[]) {
    return prisma.subject.findMany({
      where: {
        OR: [
          {
            created_by: teacherId,
          },
          {
            created_by: {
              in: adminIds,
            },
          },
        ],
      },

      orderBy: {
        created_at: "desc",
      },
    });
  },
};
