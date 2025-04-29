import mongoose, { Schema } from "mongoose";
import { logType } from "../types/log.types";

const logSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
    moduleType: {
        type: String
    },
    moduleName: {
        type: String
    },
    logType: {
        type: String
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true});

const Log = mongoose.model<logType>("logs", logSchema);

export { logType, Log };
