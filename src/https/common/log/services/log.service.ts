import { Log } from "../models/log.model";

export const addLog = async (
  userId: string,
  moduleType: string,
  moduleName: string,
  logType: string,
  description: string
) => {
  try {
    const log = await Log.create({
      userId,
      moduleType,
      moduleName,
      logType,
      description,
    });

    return null;
  } catch (error: any) {
    return Error(error.message);
  }
};
