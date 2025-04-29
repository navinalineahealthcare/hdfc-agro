import { model, Schema } from "mongoose";
import { actionTypeEnum } from "../types/activityLogs.types";

const activityLogsSchema = new Schema({
    moduleId: {
        type: Schema.Types.ObjectId
    },
    actionFrom: {
        type: String
    },
    actionTo: {
        type: String
    },
    elementId: {
        type: Schema.Types.ObjectId
    },
    description: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId
    },
    roleId: {
        type: Schema.Types.ObjectId
    },
    actionType: {
        type: String,
        enum: actionTypeEnum
    },
    createdAt: {
        type: Date
    }
}, { timestamps: true });

const ActivityLogs = model("activity_logs", activityLogsSchema);

export { ActivityLogs };