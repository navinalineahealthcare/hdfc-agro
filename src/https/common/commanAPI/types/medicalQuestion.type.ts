export interface SubQuestion  extends Document {
  text: string;
  answer: string;
}

export interface MedicalQuestion  extends Document {
  id: string;
  question: string;
  agree: string;
  isOnlyFemale?: boolean;
  subQuestions: SubQuestion[];
  remark?: string;
}
