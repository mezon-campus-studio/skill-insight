import prisma from "../config/prisma";
export const subjectService = {
  createSubject: async (data: {
    subject_name: string;
    description?: string;
  }) => {
    return prisma.subject.create({ data });
  },
  getAllSubjects: async () => {
    return prisma.subject.findMany({
      orderBy: { created_at: "desc" },
    });
  },
  updateSubject: async (id: number, data: any) => {
    return prisma.subject.update({
      where: { subject_id: id },
      data,
    });
  },

  deleteSubject: async (id: number) => {
    return await prisma.subject.delete({
      where: { subject_id: id },
    });
  },
};
