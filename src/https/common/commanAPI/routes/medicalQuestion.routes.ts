import { Router } from "express";
import { medicalQuestionController } from "../controller/medicalQuestion.controller";

const router = Router();

router.get(
  "/medical-question-list",
  medicalQuestionController.medicalQuestionList
);

export default router;
