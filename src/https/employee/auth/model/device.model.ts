import mongoose from "mongoose";
import { deviceType } from "../types/auth.type";
import { env } from "../../../../env";
import { devicesEnum } from "../../../common/enums";

const deviceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    authToken: { type: String, unique: true },
    device: {
      type: String,
      enum: devicesEnum,
      require: true,
    },
    notificationToken: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: parseInt(env.auth.deviceExpireIn) * 60 * 60 * 1000,
    },
    updatedAt: Date,
    deletedAt: Date,
  },
  { timestamps: true }
);

const Device = mongoose.model<deviceType>("Device", deviceSchema);

export { deviceType, Device };
