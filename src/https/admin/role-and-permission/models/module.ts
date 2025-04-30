import mongoose, { Schema } from "mongoose";
import { moduleType } from "../type/modules.types";

const moduleSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    displayName: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Module = mongoose.model<moduleType>("modules", moduleSchema);

export { moduleType, Module };
