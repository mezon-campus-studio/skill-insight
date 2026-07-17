import prisma from "../lib/prisma";

// =========================
// GET ALL CLASSES
// =========================
const getAll = async (teacherId: number) => {
  return await prisma.class.findMany({
    where: {
      teacher_id: teacherId,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      teacher: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
        },
      },
      _count: {
        select: {
          students: true,
          assignments: true,
        },
      },
    },
  });
};

// =========================
// GET CLASS BY ID
// =========================
const getById = async (id: string) => {

  const classroom =
    await prisma.class.findUnique({

      where: {
        class_id: Number(id),
      },

      include: {

        teacher: true,

        students: {

          include: {

            student: {

              select: {

                user_id: true,
                full_name: true,
                email: true,

              }

            }

          }

        },

        assignments: {

          include: {

            exam: true

          }

        },

        _count: {

          select: {

            students: true,
            assignments: true

          }

        }

      }

    });

  if (!classroom) return null;

  return {

    ...classroom,

    students: classroom.students.map(s => s.student)

  };

};

// =========================
// CREATE CLASS
// =========================
const create = async (data: any) => {
  return await prisma.class.create({
    data: {
      class_name: data.class_name,
      teacher_id: Number(data.teacher_id),
      description: data.description ?? null,
      class_code: data.class_code ?? null,
    },
  });
};

// =========================
// UPDATE CLASS
// =========================
const update = async (
  id: string,
  data: any
) => {
  return await prisma.class.update({
    where: {
      class_id: Number(id),
    },
    data: {
      class_name: data.class_name,
      description: data.description ?? null,
      class_code: data.class_code ?? null,
    },
  });
};

// =========================
// DELETE CLASS
// =========================
const remove = async (id: string) => {
  return await prisma.class.delete({
    where: {
      class_id: Number(id),
    },
  });
};

// =========================
// DELETE MANY CLASSES
// =========================
const deleteMany = async (ids: number[]) => {
  return await prisma.class.deleteMany({
    where: {
      class_id: {
        in: ids,
      },
    },
  });
};

// =========================
// ADD STUDENT
// =========================
const addStudent = async (
  classId: string,
  studentId: string
) => {
  return await prisma.classStudent.create({
    data: {
      class_id: Number(classId),
      student_id: Number(studentId),
    },
  });
};

// =========================
// REMOVE STUDENT
// =========================
const removeStudent = async (
  classId: string,
  studentId: string
) => {
  return await prisma.classStudent.deleteMany({
    where: {
      class_id: Number(classId),
      student_id: Number(studentId),
    },
  });
};

// =========================
// GET STUDENTS
// =========================
const getStudents = async (
  classId: string
) => {
  return await prisma.classStudent.findMany({
    where: {
      class_id: Number(classId),
    },
    include: {
      student: true,
    },
  });
};

// =========================
// ASSIGN EXAM
// =========================
const assignExam = async (
  classId: string,
  data: any
) => {
  return await prisma.assignment.create({
    data: {
      class_id: Number(classId),
      exam_id: Number(data.exam_id),
      teacher_id: Number(data.teacher_id),
      title: data.title,
      start_at: new Date(data.start_at),
      end_at: new Date(data.end_at),
      duration: Number(data.duration),
    },
  });
};

// =========================
// JOIN CLASS
// =========================
const joinClass = async (
  studentId: number,
  classCode: string
) => {

  const classroom =
    await prisma.class.findUnique({
      where: {
        class_code: classCode,
      },
    });

  if (!classroom) {
    throw new Error("Mã lớp không tồn tại");
  }

  const existed =
    await prisma.classStudent.findFirst({
      where: {
        class_id: classroom.class_id,
        student_id: studentId,
      },
    });

  if (existed) {
    throw new Error("Bạn đã tham gia lớp này");
  }

  return await prisma.classStudent.create({
    data: {
      class_id: classroom.class_id,
      student_id: studentId,
    },
  });

};

const getTeacherClasses = async (
  teacherId: number
) => {

  return await prisma.class.findMany({

    where: {

      teacher_id: teacherId

    },

    include: {

      teacher: {

        select: {

          user_id: true,
          full_name: true,
          email: true

        }

      },

      _count: {

        select: {

          students: true,
          assignments: true

        }

      }

    },

    orderBy: {

      created_at: "desc"

    }

  });

};

const getStudentClasses = async (
  studentId: number
) => {

  const data =
    await prisma.classStudent.findMany({

      where: {

        student_id: studentId

      },

      include: {

        class: {

          include: {

            teacher: {

              select: {

                user_id: true,
                full_name: true,
                email: true

              }

            },

            _count: {

              select: {

                students: true,
                assignments: true

              }

            }

          }

        }

      }

    });

  return data.map(item => item.class);

};

export {
  getAll,
  getById,
  create,
  update,
  remove,
  deleteMany,
  addStudent,
  removeStudent,
  getStudents,
  assignExam,
  joinClass,
  getTeacherClasses,
  getStudentClasses,
};