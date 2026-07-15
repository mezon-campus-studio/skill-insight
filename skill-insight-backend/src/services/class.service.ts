import * as classRepo from "../repositories/class.repository";

// =========================
// GET ALL CLASSES
// =========================
export const getClasses = async (
  teacherId: number
) => {
  return await classRepo.getAll(
    teacherId
  );
};

// =========================
// GET CLASS BY ID
// =========================
export const getClassById = async (
  id: string
) => {
  return await classRepo.getById(
    id
  );
};

// =========================
// CREATE CLASS
// =========================
export const createClass = async (
  data: any
) => {
  return await classRepo.create(
    data
  );
};

// =========================
// UPDATE CLASS
// =========================
export const updateClass = async (
  id: string,
  data: any
) => {
  return await classRepo.update(
    id,
    data
  );
};

// =========================
// DELETE CLASS
// =========================
export const deleteClass = async (
  id: string
) => {
  return await classRepo.remove(
    id
  );
};

// =========================
// DELETE MANY CLASSES
// =========================
export const deleteManyClasses = async (
  ids: number[]
) => {
  return await classRepo.deleteMany(
    ids
  );
};

// =========================
// ADD STUDENT
// =========================
export const addStudent = async (
  classId: string,
  studentId: string
) => {
  return await classRepo.addStudent(
    classId,
    studentId
  );
};

// =========================
// REMOVE STUDENT
// =========================
export const removeStudent = async (
  classId: string,
  studentId: string
) => {
  return await classRepo.removeStudent(
    classId,
    studentId
  );
};

// =========================
// GET STUDENTS
// =========================
export const getStudents = async (
  classId: string
) => {
  return await classRepo.getStudents(
    classId
  );
};

// =========================
// ASSIGN EXAM
// =========================
export const assignExam = async (
  classId: string,
  data: any
) => {
  return await classRepo.assignExam(
    classId,
    data
  );
};

// =========================
// JOIN CLASS
// =========================
export const joinClass = async (
  studentId: number,
  classCode: string
) => {

  return await classRepo.joinClass(
    studentId,
    classCode
  );

};

export const getMyClasses = async (
  studentId: number
) => {

  return await classRepo.getMyClasses(
    studentId
  );

};