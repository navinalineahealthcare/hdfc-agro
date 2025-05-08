import { Request, Response } from "express";
import { AssignMaster } from "../../doctor/models/assignMaster.model";
import { CaseStatusEnum } from "../../../common/enums";

export default class teleMerController {
  public static async teleMerlist(req: Request, res: Response) {
    try {
      const { id: proposalNo } = req.body.validatedParamsData;
      const teleMerdata = await AssignMaster.find({
        proposalNo: proposalNo,
        deletedAt: null,
        status: CaseStatusEnum.RECALL,
      }).select("-dispositionId -callViaPhone -remark -doctorId -status -email -history").populate({
        path: "openCaseId",
        select:
          "language address city state pincode age gender clientDob weight height bmi relationship educationQualification occupation",
        match: { deletedAt: null },
      });

      if (!teleMerdata) {
        res.status(404).json({
          status: false,
          message: req.t("crud.not_found", { model: "proposal data" }),
        });
      }

      res.status(200).json({
        status: true,
        data: teleMerdata,
        message: req.t("crud.list", { model: "Activity Logs" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}
