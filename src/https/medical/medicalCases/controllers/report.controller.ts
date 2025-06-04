import { Request, Response } from "express";
import { AssignMaster } from "../../../admin/doctor/models/assignMaster.model";
import { pagination } from "../../../../utils/utils";
import { salesCaseListResponse } from "../responses/dashboard.response";
import { CaseStatusEnum } from "../../../common/enums";

class medicalReportController {
  public static async medicalReportcasesList(req: Request, res: Response) {
    try {
      const { page = 1, perPage = 10 } = req.body.pagination || {};
      const {
        search = "",
        fromDate,
        toDate,
        tpaName,
      } = req.body.validatedQueryData || {};

      const filter: any = {
        status: CaseStatusEnum.CLOSED,
        deletedAt: null,
      };

      if (search && typeof search === "string" && search.trim() !== "") {
        filter.$or = [
          { proposerName: { $regex: new RegExp(search, "i") } },
          { insuredName: { $regex: new RegExp(search, "i") } },
          { proposalNo: { $regex: new RegExp(search, "i") } },
        ];
      }
      // Date range filter
      if (fromDate || toDate) {
        filter.requestDate = {};
        if (fromDate) filter.requestDate.$gte = new Date(fromDate);
        if (toDate) filter.requestDate.$lte = new Date(toDate);
      }
      if (tpaName && typeof tpaName === "string") {
        filter.tpaName = { $regex: new RegExp(tpaName, "i") };
      }

      const total = await AssignMaster.countDocuments(filter);

      const assignCases = await AssignMaster.find(filter)
        .populate("openCaseId")
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .lean();

      res.status(200).json({
        status: true,
        data: salesCaseListResponse(assignCases),
        pagination: pagination(total, perPage, page),
        message: req.t("salescases.list"),
      });
    } catch (error: any) {
      console.error("Error in report List:", error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch report cases. Please try again.",
      });
    }
  }
}

export default medicalReportController;
