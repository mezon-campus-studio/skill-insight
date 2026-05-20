// import { Request, Response } from "express";
// import * as classService from "../services/class.service";

// export const createClassController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {

//     const result =
//       await classService.createClass(req.body);

//     res.json(result);

//   } catch (error: any) {

//     res.status(500).json({
//       message: error.message
//     });

//   }
// };

// export const addStudentController = async (
//   req: Request,
//   res: Response
// ) => {

//   try {

//     const result =
//       await classService.addStudent(
//         req.params.id,
//         req.body.studentId
//       );

//     res.json(result);

//   } catch (error: any) {

//     res.status(500).json({
//       message: error.message
//     });

//   }

// };

// export const removeStudentController = async (
//   req: Request,
//   res: Response
// ) => {

//   try {

//     await classService.removeStudent(
//       req.params.id,
//       req.params.studentId
//     );

//     res.json({
//       message: "Removed successfully"
//     });

//   } catch (error: any) {

//     res.status(500).json({
//       message: error.message
//     });

//   }

// };

// export const getStudentsController = async (
//   req: Request,
//   res: Response
// ) => {

//   try {

//     const result =
//       await classService.getStudents(
//         req.params.id
//       );

//     res.json(result);

//   } catch (error: any) {

//     res.status(500).json({
//       message: error.message
//     });

//   }

// };

// export const assignExamController = async (
//   req: Request,
//   res: Response
// ) => {

//   try {

//     const result =
//       await classService.assignExam(
//         req.params.id,
//         req.body
//       );

//     res.json(result);

//   } catch (error: any) {

//     res.status(500).json({
//       message: error.message
//     });

//   }

// };