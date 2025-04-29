import { ActivityLogs } from "../models/activityLogs.model";

export const addActivityLogs = async (data: any) => {
  try {
    const {
      moduleId,
      actionFrom,
      actionTo,
      userId,
      buyRequestId,
      elementId,
      description,
      actionType,
      roleId,
    } = data;

    const activityLog = await ActivityLogs.create({
      moduleId,
      actionFrom,
      actionTo,
      userId,
      buyRequestId,
      elementId,
      description,
      actionType,
      roleId,
    });

    return true;
  } catch (error: any) {
    return error;
  }
};
