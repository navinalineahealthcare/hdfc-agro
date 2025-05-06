import { Request, Response } from "express";
import HDFCCases from "../../../common/hdfcCases/models/hdfcCases.model";
import { CaseStatusEnum, statusEnum } from "../../../common/enums";
import { pagination } from "../../../../utils/utils";
import { logger } from "../../../../providers/logger";

export default class doctorController {
  public static async doctorOpencaseList(req: Request, res: Response) {
    try {
      const { proposerName, productName, fromDate, toDate, search } =
        req.body.validatedQueryData || {};
      const { page = 1, perPage = 10 } = req.body.pagination || {};
      const { sortBy = "createdAt", sortType = "desc" } =
        req.body.validatedSortData || {};

      // Filter query
      const filterQuery: any = {
        status: CaseStatusEnum.RECEIVED,
        deletedAt: null,
      };

      if (proposerName) {
        filterQuery.proposerName = { $regex: new RegExp(proposerName, "i") };
      }

      if (productName) {
        filterQuery.productName = { $regex: new RegExp(productName, "i") };
      }

      if (search && typeof search === "string" && search.trim() !== "") {
        filterQuery.$or = [
          { proposerName: { $regex: new RegExp(search, "i") } },
          { proposalNo: { $regex: new RegExp(search, "i") } },
          { productName: { $regex: new RegExp(search, "i") } },
          { caseId: { $regex: new RegExp(search, "i") } },
        ];
      }

      if (fromDate && toDate) {
        filterQuery.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(new Date(toDate).setUTCHours(23, 59, 59)),
        };
      }

      // Sorting
      const sort: any = {
        [sortBy]: sortType === "asc" ? 1 : -1,
      };

      // Count total documents
      const totalCount = await HDFCCases.countDocuments(filterQuery);

      // Get paginated and sorted list
      const doctorList = await HDFCCases.find(filterQuery)
        .select(
          "proposerName createdAt customerEmailId agentName contactNo status proposalNo"
        )
        .sort(sort)
        .skip(perPage * (page - 1))
        .limit(perPage);

      res.status(200).json({
        status: true,
        data: doctorList,
        pagination: pagination(totalCount, perPage, page),
        message: req.t("crud.list", { model: "Doctor Open Case" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: (error as any).message,
      });
    }
  }
  public static async doctorClosedCaseList(req: Request, res: Response) {
    try {
      const { proposerName, productName, fromDate, toDate, search } =
        req.body.validatedQueryData || {};
      const { page = 1, perPage = 10 } = req.body.pagination || {};
      const { sortBy = "createdAt", sortType = "desc" } =
        req.body.validatedSortData || {};

      // Filter query
      const filterQuery: any = {
        status: { $ne: CaseStatusEnum.CLOSED },
        deletedAt: null,
      };

      if (proposerName) {
        filterQuery.proposerName = { $regex: new RegExp(proposerName, "i") };
      }

      if (productName) {
        filterQuery.productName = { $regex: new RegExp(productName, "i") };
      }

      if (search && typeof search === "string" && search.trim() !== "") {
        filterQuery.$or = [
          { proposerName: { $regex: new RegExp(search, "i") } },
          { proposalNo: { $regex: new RegExp(search, "i") } },
          { productName: { $regex: new RegExp(search, "i") } },
          { caseId: { $regex: new RegExp(search, "i") } },
        ];
      }

      if (fromDate && toDate) {
        filterQuery.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(new Date(toDate).setUTCHours(23, 59, 59)),
        };
      }

      // Sorting
      const sort: any = {
        [sortBy]: sortType === "asc" ? 1 : -1,
      };

      // Count total documents
      const totalCount = await HDFCCases.countDocuments(filterQuery);

      // Get paginated and sorted list
      const doctorList = await HDFCCases.find(filterQuery)
        .select(
          "proposerName createdAt customerEmailId agentName contactNo status proposalNo"
        )
        .sort(sort)
        .skip(perPage * (page - 1))
        .limit(perPage);

      res.status(200).json({
        status: true,
        data: doctorList,
        pagination: pagination(totalCount, perPage, page),
        message: req.t("crud.list", { model: "Doctor Closed Case" }), // Add translation key for closed case list
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async doctorAssignCase(req: Request, res: Response) {
    try {
    } catch (error) {
      if (error instanceof Error) {
        logger.error("Error in doctorAssignCase: ", error);
        res.status(500).json({
          status: false,
          message: error.message,
        });
      } else {
        logger.error("Error in doctorAssignCase: ", error);
        res.status(500).json({
          status: false,
          message: "An unknown error occurred",
        });
      }
    }
  }
}
