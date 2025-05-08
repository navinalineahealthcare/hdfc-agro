import { Schema, model } from "mongoose";
import { MedicalQuestion, SubQuestion } from "../types/medicalQuestion.type";

const SubQuestionSchema = new Schema<SubQuestion>({
  text: { type: String, required: true },
  answer: { type: String, required: true },
});

const MedicalQuestionSchema = new Schema<MedicalQuestion>({
  question: { type: String, required: true },
  id: { type: String, required: true },
  agree: { type: String, required: true },
  isOnlyFemale: { type: Boolean, default: false },
  subQuestions: { type: [SubQuestionSchema], required: true },
  remark: { type: String, default: "" },
});

const MedicalQuestion = model<MedicalQuestion>(
  "medical_questions",
  MedicalQuestionSchema
);

export {MedicalQuestion};
