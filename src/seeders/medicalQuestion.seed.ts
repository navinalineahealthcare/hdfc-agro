import mongoose from "mongoose";
import  { MedicalQuestion } from "../https/common/commanAPI/models/medicalQuestion.modal";
import { connection } from "../providers/db";
import MedicalQuestions from "../storage/data/merQuestions.json";

const seedMedicalQuestions = async () => {
  try {
    await connection();

    const bulkOps = MedicalQuestions.map((q: any) => ({
      updateOne: {
        filter: { id: q.id },
        update: {
          $set: {
            question: q.question,
            agree: q.agree,
            isOnlyFemale: q.isOnlyFemale||false,
            remark: q.remark,
            subQuestions: q.subQuestions.map((sq: any) => ({
              text: sq.text,
              answer: sq.answer,
            })),
          },
        },
        upsert: true,
      },
    }));

    const result = await MedicalQuestion.bulkWrite(bulkOps);

    console.log("✅ Medical questions seeded successfully");
    console.table([
      { Inserted: result.upsertedCount, Updated: result.modifiedCount },
    ]);
  } catch (err) {
    console.error("❌ Failed to seed medical questions");
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};

seedMedicalQuestions().catch(console.error);
