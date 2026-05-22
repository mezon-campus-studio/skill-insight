// import { Router } from "express";

// import {
//   submitExamController
// } from "../controllers/submission.controller";

// const router = Router();

// router.post("/", submitExamController);

// export default router;

import { Router } from 'express';

import {
  submitExam
} from '../controllers/submission.controller';

const router = Router();

router.post('/', submitExam);

export default router;