import mongoose, { model, Schema, Model } from "mongoose";
import { faqType, statusEnum, userTypeEnum } from "../types/faq.type";

const faqSchema = new Schema(
  {
    question: {
      type: String,
      require: true,
    },
    answer: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: statusEnum.ACTIVE,
      require: true,
    },
    type: {
      type: String,
      enum: userTypeEnum,
      default: userTypeEnum.MERCHANT,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
    deletedAt: Date,
  },
  { timestamps: true }
);

const Faq = mongoose.model<faqType>("Faq", faqSchema);

export { faqType, Faq };
