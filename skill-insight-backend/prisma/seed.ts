import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // Xóa dữ liệu cũ
  await prisma.classStudent.deleteMany();
  await prisma.class.deleteMany();

  // Chỉ xóa user teacher/student để tránh ảnh hưởng admin
  await prisma.user.deleteMany({
    where: {
      role: {
        in: [Role.teacher, Role.student],
      },
    },
  });

  // ===========================
  // TEACHERS
  // ===========================

  const teachers = [];

  for (let i = 1; i <= 5; i++) {
    const teacher = await prisma.user.create({
      data: {
        full_name: `Giáo viên ${i}`,
        email: `teacher${i}@school.com`,
        password: "123456",
        role: Role.teacher,
        status: true,
      },
    });

    teachers.push(teacher);
  }

  console.log(`✔ Created ${teachers.length} teachers`);

  // ===========================
  // CLASSES
  // ===========================

  const classes = [];

  const classNames = [
    "10A1",
    "10A2",
    "11A1",
    "11A2",
    "12A1",
  ];

  for (let i = 0; i < classNames.length; i++) {
    const cls = await prisma.class.create({
      data: {
        class_name: `Lớp ${classNames[i]}`,
        class_code: classNames[i],
        description: `Lớp học ${classNames[i]}`,
        teacher_id: teachers[i].user_id,
      },
    });

    classes.push(cls);
  }

  console.log(`✔ Created ${classes.length} classes`);

  // ===========================
  // STUDENTS
  // ===========================

  const students = [];

  for (let i = 1; i <= 35; i++) {
    const student = await prisma.user.create({
      data: {
        full_name: `Học sinh ${i}`,
        email: `student${i}@school.com`,
        password: "123456",
        role: Role.student,
        status: true,
      },
    });

    students.push(student);
  }

  console.log(`✔ Created ${students.length} students`);

  // ===========================
  // CLASS STUDENTS
  // ===========================

  let index = 0;

  for (const cls of classes) {
    const totalStudents = 7;

    for (let i = 0; i < totalStudents; i++) {
      await prisma.classStudent.create({
        data: {
          class_id: cls.class_id,
          student_id: students[index].user_id,
        },
      });

      index++;
    }
  }

  console.log("✔ Assigned students to classes");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
  console.error(e);
})
.finally(async () => {
  await prisma.$disconnect();
});
