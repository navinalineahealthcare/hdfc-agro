import mongoose, { Schema } from "mongoose";
import { permissionType } from "../type/permission.types";

const permissionSchema = new Schema(
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
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "modules" },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "roles" },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
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

const Permission = mongoose.model<permissionType>(
  "permissions",
  permissionSchema
);

export { permissionType, Permission };
