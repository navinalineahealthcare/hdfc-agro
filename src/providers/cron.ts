import { CronJob } from "cron";
import { removeUnusedMedia } from "../commands/removeUnusedMedia";
import { CronEnums } from "../utils/utils";

//IMPORT CRON HERE
export class cron {
  public static async setup(): Promise<void> {
    new CronJob(
      CronEnums.EVERYDAY_MIDNIGHT,
      removeUnusedMedia,
      undefined,
      undefined,
      undefined,
      undefined,
      true
    ).start();
  }
}
