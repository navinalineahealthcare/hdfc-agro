import { Request, Response } from "express";
import { AssignMaster } from "../../../admin/doctor/models/assignMaster.model";
import { pagination } from "../../../../utils/utils";
import { salesCaseListResponse } from "../responses/salescases.response";

class salescasesController {
  public static async salescasesList(req: Request, res: Response) {
    try {
      const AssignCaseId = req.body.auth.device.userId;

      const { page = 1, perPage = 10 } = req.body.pagination || {};
      const { search = "" } = req.body.validatedQueryData || {};

      const assignCase = await AssignMaster.findById(AssignCaseId).lean();

      if (!assignCase) {
        res.status(404).json({
          status: false,
          message: "Assigned case not found.",
        });
        return;
      }

      const filter: any = {
        proposalNo: assignCase.proposalNo,
        deletedAt: null,
      };

      if (search && typeof search === "string" && search.trim() !== "") {
        filter.$or = [
          { proposerName: { $regex: new RegExp(search, "i") } },
          { insuredName: { $regex: new RegExp(search, "i") } },
          { proposalNo: { $regex: new RegExp(search, "i") } },
        ];
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
      console.error("Error in salescasesList:", error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch sales cases. Please try again.",
      });
    }
  }

  public static async salescasesdetails(req: Request, res: Response) {
    try {
      // const { userId } = req.body.auth.device;
      const { id: assignedToId } = req.body.validatedParamsData;

      console.log({ assignedToId });

      const assignCase = await AssignMaster.findById(assignedToId).populate(
        "openCaseId"
      );
      console.log({ assignCase });
      if (!assignCase) {
        res.status(404).json({
          status: false,
          message: "Sales case details not found.",
        });
        return;
      }

      res.status(200).json({
        status: true,
        data: assignCase,
        message: req.t("crud.details", { model: "Sales Case" }),
      });
    } catch (error: any) {
      console.error("Error in salescasesdetails:", error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch case details. Please try again later.",
      });
      return;
    }
  }

  public static async salesCasesCallDisposition(req: Request, res: Response) {
    try {
      const { id: assignedToId } = req.body.validatedParamsData;

      const assignCase = await AssignMaster.findById(assignedToId)
        .select("dispositionId")
        .populate({
          path: "dispositionId.id",
          select: "name description status",
        });

      if (!assignCase) {
        res.status(404).json({
          status: false,
          message: "Sales case call disposition details not found.",
        });
        return;
      }
      res.status(200).json({
        status: true,
        data: assignCase,
        message: req.t("crud.details", { model: "Sales Case" }),
      });
    } catch (error) {}
  }

  public static async salesCasesStatusDetails(req: Request, res: Response) {
    try {
      const { id: assignedToId } = req.body.validatedParamsData;

      const assignCase = await AssignMaster.findById(assignedToId).select(
        "history"
      );

      if (!assignCase) {
        res.status(404).json({
          status: false,
          message: "Sales case call disposition details not found.",
        });
        return;
      }
      res.status(200).json({
        status: true,
        data: assignCase,
        message: req.t("crud.details", { model: "Sales Case" }),
      });
    } catch (error) {}
  }
}

export default salescasesController;
