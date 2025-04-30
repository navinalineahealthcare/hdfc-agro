import mongoose, { Schema } from "mongoose";
import { roleType } from "../type/role.types";
import { statusEnum } from "../../../common/enums";

const roleSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    displayName: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: statusEnum.ACTIVE,
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

const Role = mongoose.model<roleType>("roles", roleSchema);

export { roleType, Role };
