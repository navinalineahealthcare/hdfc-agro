import { object, string, array, boolean } from "yup";

// Sub-question schema
const subQuestionSchema = object({
  _id: string().optional(),
  text: string().optional(),
  answer: string().nullable(),
});

// Medical question schema with conditional validation
const medicalQuestionSchema = object({
  _id: string().required(),
  agree: string().nullable(),
  // agree: string().oneOf(["Yes", "No"]).required(),
  question: string().required(),
  remark: string().optional(),
  id: string().optional(),
  isOnlyFemale: boolean().required(),
  subQuestions: array().of(subQuestionSchema),
  // .required()
  // .test(
  //   "answers-required-if-agree-yes",
  //   "All subQuestion answers are required when agree is Yes",
  //   function (subQuestions) {
  //     const { agree } = this.parent;
  //     if (agree === "Yes") {
  //       return subQuestions.every((sq: any) => sq.answer?.trim());
  //     }
  //     return true;
  //   }
  // ),
});

// Open case schema
const openCaseSchema = object({
  _id: string().required(),
  weight: string().nullable(),
  height: string().nullable(),
  bmi: string().nullable(),
  gender: string().oneOf(["M", "F"]).required(),
  relationship: string().nullable(),
  educationQualification: string().nullable(),
  occupation: string().nullable(),
});

// Individual data item schema
const dataItemSchema = object({
  _id: string().required(),
  alternateMobileNo: string().nullable(),
  openCaseId: openCaseSchema.required(),
  questions: array().of(medicalQuestionSchema).required(),
});

// Main schema
export const medicalQuestionValidationRequest = object({
  proposalNo: string().required(),
  data: array().of(dataItemSchema).required(),
});
