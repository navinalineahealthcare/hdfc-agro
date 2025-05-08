import { Request, Response } from "express";
import { MedicalQuestion } from "../models/medicalQuestion.modal";

export class medicalQuestionController {
  public static async medicalQuestionList(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const medicalQuestion = await MedicalQuestion.find({})
        .select("question id agree isOnlyFemale subQuestions remark")
        .exec();

      res.status(200).json({
        status: true,
        message: "Success",
        data: medicalQuestion,
      });
    } catch (error) {
      console.error("Error importing Excel data:", error);
      res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }
}
