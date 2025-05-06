import { Request, Response } from "express";
import { Types } from "mongoose";
import { logger } from "../../../../providers/logger";
import { pagination } from "../../../../utils/utils";
import { CaseStatusEnum, statusEnum } from "../../../common/enums";
import HDFCCases from "../../../common/hdfcCases/models/hdfcCases.model";
import { Admin } from "../../auth/model/admin.model";
import { Role } from "../../role-and-permission/models/role";
import { AssignMaster } from "../models/assignMaster.model";

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
        status: CaseStatusEnum.CLOSED || CaseStatusEnum.CANCELLED,
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
      const { id: assignedToId } = req.body.validatedParamsData;
      const id = req.body.auth.user;
      const { casesIds } = req.body.validatedData;

      const assignedDataExists = await Admin.findById({
        _id: assignedToId,
      }).lean();

      console.log(assignedDataExists, "assignedDataExists");

      if (!assignedDataExists) {
        res.status(404).json({
          status: false,
          message: "Assigned data not found",
        });
      }

      const HDFCCasesAssigned = await HDFCCases.find({
        _id: { $in: casesIds },
        status: CaseStatusEnum.RECEIVED,
        deletedAt: null,
      }).lean();

      console.log(HDFCCasesAssigned, "HDFCCasesAssigned");
      if (HDFCCasesAssigned.length === 0) {
        res.status(404).json({
          status: false,
          message: "No cases found with the provided IDs",
        });
      }

      const caseDocs = await Promise.all(
        casesIds.map(async (caseId: string) => {
          const HDFCCasesData = await HDFCCases.findById(caseId).lean();

          if (!HDFCCasesData) {
            throw new Error(`Case with ID ${caseId} not found`);
          }

          return {
            requestDate: HDFCCasesData.createdAt,
            proposalNo: HDFCCasesData.proposalNo,
            proposerName: HDFCCasesData.proposerName,
            insuredName: HDFCCasesData.insuredName,
            mobileNo: HDFCCasesData.contactNo,
            email: HDFCCasesData?.customerEmailId ?? null,
            status: CaseStatusEnum.RECALL,
            doctorId: new Types.ObjectId(assignedToId),
            openCaseId: HDFCCasesData._id,
            alternateMobileNo: null,
            language: null,
            callbackDate: null,
            remark: [],
            callViaPhone: false,
            dispositionId: null,
            createdBy: new Types.ObjectId(id),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          };
        })
      );

      console.log(caseDocs, "caseDocs");
      // Run insertMany
      await AssignMaster.insertMany(caseDocs);

      await HDFCCases.updateMany(
        {
          _id: { $in: casesIds },
          // status: CaseStatusEnum.RECEIVED,
          // deletedAt: null,
        },
        { $set: { status: CaseStatusEnum.RECALL } },
        { new: true }
      );

      res.status(200).json({
        status: true,
        message: "Cases assigned successfully",
      });
    } catch (error) {
      logger.error("Error in doctorAssignCase: ", error);
      res.status(500).json({
        status: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }

  public static async doctorList(req: Request, res: Response) {
    try {
      const role = await Role.findOne({
        name: "DOCTOR",
        deletedAt: null,
      }).lean();

      if (!role) {
        res.status(404).json({
          status: false,
          message: "Role not found",
        });
      }
      const objectId = role?._id;
      console.log(objectId, "objectId");

      const doctorList = await Admin.find({
        roleId: objectId,
        status: statusEnum.ACTIVE,
        deletedAt: null,
      })
        .select("firstName lastName email")
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json({
        status: true,
        data: doctorList,
        message: req.t("crud.list", { model: "Doctor" }),
      });
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
