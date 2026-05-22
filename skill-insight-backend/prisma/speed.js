const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang xóa dữ liệu cũ để reset...');
  // Xóa bảng Subject trước vì nó chứa khóa ngoại phụ thuộc vào User
  await prisma.subject.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🌱 Đang thêm dữ liệu mẫu...');

  // 1. Tạo các Users với các vai trò khác nhau
  const admin = await prisma.user.create({
    data: {
      full_name: 'Nguyễn Văn Admin',
      email: 'admin@school.com',
      password: 'admin123456H@', // Nên hash password ở dự án thực tế
      role: 'admin',
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      full_name: 'Trần Thị Giáo Viên',
      email: 'giovien.tran@school.com',
      password: 'teacher123456H@',
      role: 'teacher',
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      full_name: 'Lê Hoàng Thầy',
      email: 'thay.le@school.com',
      password: 'teacher789456H@',
      role: 'teacher',
    },
  });

  const student = await prisma.user.create({
    data: {
      full_name: 'Phạm Học Sinh',
      email: 'hocsinh.pham@school.com',
      password: 'student123456H@',
      role: 'student',
    },
  });

  // 2. Tạo các Môn học (Subjects) và gán ID của giáo viên vừa tạo
  await prisma.subject.createMany({
    data: [
      {
        subject_name: 'Toán học Đại cương',
        description: 'Môn học cung cấp kiến thức nền tảng về giải tích và đại số.',
        created_by: teacher1.user_id, // Gán cho Trần Thị Giáo Viên
      },
      {
        subject_name: 'Lập trình JavaScript',
        description: 'Học về biến, hàm, bất đồng bộ và Prisma ORM cơ bản.',
        created_by: teacher1.user_id,
      },
      {
        subject_name: 'Vật lý Ứng dụng',
        description: 'Cơ học chất lưu và các hiện tượng quang học đời sống.',
        created_by: teacher2.user_id, // Gán cho Lê Hoàng Thầy
      },
    ],
  });

  console.log('✨ Đã thêm dữ liệu test thành công!');
}

main()
  .catch((e) => {
    console.error('❌ Có lỗi xảy ra khi tạo dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });