import { Request, Response } from "express";

import { AssignMaster } from "../../../admin/doctor/models/assignMaster.model";
import {
  createCaseToken,
  createDevice,
  createToken,
  deleteDevice,
} from "../services/auth.service";
import { escapeRegex } from "../../../../utils/utils";
class authSalesController {
  public static async loginWithProposalNum(req: Request, res: Response) {
    try {
      const { proposalNum, deviceType, notificationToken } =
        req.body.validatedData;
      const normalizedInput = escapeRegex(proposalNum.trim()).replace(
        /\s+/g,
        "\\s*\\.?\\s*"
      );

      // Regex pattern for exact full-name match with flexibility
      const regexPattern = `^${normalizedInput}$`;

      const cases = await AssignMaster.find({
        $or: [
          { proposalNo: { $regex: regexPattern, $options: "i" } },
          { proposerName: { $regex: regexPattern, $options: "i" } },
          { insuredName: { $regex: regexPattern, $options: "i" } },
        ],
      }).lean();

      if (!cases || cases.length === 0) {
        res.status(404).json({
          status: false,
          message:
            "No matching records found for the provided proposal number.",
        });
        return;
      }

      const token = await createCaseToken(cases[0]); // You might need to extract user-specific info here

      const device = await createDevice(
        cases[0]?._id as string,
        token,
        deviceType,
        notificationToken
      );

      if (!device) {
        res.status(400).json({
          status: false,
          message: req.t("user.wrong_email_or_password"),
        });
      }

      res.status(200).json({
        status: true,
        accessToken: token,
        message: `Logged In successfully with ${cases[0]?.proposalNo} number`,
      });
      return;
    } catch (error: any) {
      console.error("Error in loginWithProposalNum:", error);

      res.status(500).json({
        status: false,
        message: "An unexpected error occurred. Please try again later.",
      });
      return;
    }
  }

  public static async logout(req: Request, res: Response) {
    const { device, userId } = req.body.auth;
    await deleteDevice(device.id, device.userId);

    res.json({
      status: true,
      message: req.t("user.logged_out"),
    });
  }
}

export default authSalesController;
