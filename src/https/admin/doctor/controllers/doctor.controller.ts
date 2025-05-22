import { Request, Response } from "express";
import { Types } from "mongoose";
import { logger } from "../../../../providers/logger";
import { pagination } from "../../../../utils/utils";
import { CaseStatusEnum, statusEnum } from "../../../common/enums";
import HDFCCases from "../../../common/hdfcCases/models/hdfcCases.model";
import { Admin } from "../../auth/model/admin.model";
import { Role } from "../../role-and-permission/models/role";
import { AssignMaster } from "../models/assignMaster.model";
import { Disposition } from "../../../common/commanAPI/models/disposition.modal";
import { TeleMer } from "../../teleMer/models/teleMer.model";

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
        status: { $in: [CaseStatusEnum.RECEIVED, CaseStatusEnum.QC_REJECTED] },
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
          "proposerName createdAt customerEmailId agentName contactNo status proposalNo insuredName"
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
      const userId = req.body.auth.user;
      const { casesIds } = req.body.validatedData;

      // Check if assigned doctor exists
      const assignedDataExists = await Admin.findById(assignedToId).lean();
      if (!assignedDataExists) {
        res.status(404).json({
          status: false,
          message: "Assigned doctor not found",
        });
      }

      // Fetch only RECEIVED and active cases
      const validCases = await HDFCCases.find({
        _id: { $in: casesIds },
        status: CaseStatusEnum.RECEIVED,
        deletedAt: null,
      }).lean();

      if (validCases.length === 0) {
        res.status(404).json({
          status: false,
          message: "No valid cases found with the provided IDs",
        });
      }

      // Prepare documents for assignment
      const caseDocs = validCases.map((caseData) => ({
        requestDate: caseData.createdAt,
        requestId: caseData.requestId,
        proposalNo: caseData.proposalNo,
        proposerName: caseData.proposerName,
        insuredName: caseData.insuredName,
        mobileNo: caseData.contactNo,
        email: caseData.customerEmailId ?? null,
        status: CaseStatusEnum.RECALL,
        doctorId: new Types.ObjectId(assignedToId),
        openCaseId: caseData._id,
        alternateMobileNo: null,
        language: null,
        callbackDate: null,
        remark: [],
        callViaPhone: false,
        dispositionId: null,
        createdBy: new Types.ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }));

      // Insert new assignments
      await AssignMaster.insertMany(caseDocs);

      // Update the original cases' status to RECALL
      await HDFCCases.updateMany(
        { _id: { $in: validCases.map((c) => c._id) } },
        { $set: { status: CaseStatusEnum.RECALL } }
      );

      res.status(200).json({
        status: true,
        message: "Cases assigned successfully",
      });
    } catch (error) {
      logger.error("Error in doctorAssignCase:", error);
      res.status(500).json({
        status: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }
  public static async doctorAssigncaseList(req: Request, res: Response) {
    try {
      const { proposerName, productName, fromDate, toDate, search } =
        req.body.validatedQueryData || {};
      const { page = 1, perPage = 10 } = req.body.pagination || {};
      const { sortBy = "createdAt", sortType = "desc" } =
        req.body.validatedSortData || {};
      const auth = req.body.auth;
      console.log(auth, "auth------------------------>>>>>>>>");
      const isAdmin =
        req?.body?.auth?.roleId?.name == "Admin" ||
        req?.body?.auth?.roleId?.name == "Super_Admin"
          ? true
          : false;
      // Filter query
      const filterQuery: any = {
        ...(isAdmin ? {} : { doctorId: req.body.auth.user }),
        status: CaseStatusEnum.RECALL,
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
      const totalCount = await AssignMaster.countDocuments(filterQuery);

      // Get paginated and sorted list
      const doctorList = await AssignMaster.find(filterQuery)
        .select(
          "requestDate requestId proposalNo proposerName insuredName mobileNo status email doctorId alternateMobileNo language callbackDate remark callViaPhone dispositionId openCaseId"
        )
        .populate({
          path: "doctorId",
          select: "firstName lastName email",
        })
        .populate({
          path: "dispositionId",
          select: "name description status",
        })
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
  public static async addRemark(req: Request, res: Response) {
    try {
      const { id: casesId } = req.body.validatedParamsData;
      const { remark } = req.body.validatedData;
      const userId = req.body.auth.user;

      const caseData = await AssignMaster.findById(casesId).lean();
      if (!caseData) {
        res.status(404).json({
          status: false,
          message: "Case not found",
        });
      }

      // Check if the case is already closed
      if (caseData && caseData.status !== CaseStatusEnum.RECALL) {
        res.status(400).json({
          status: false,
          message: "Cannot add remark to a closed case",
        });
      }
      // Update the case with the new remark
      await AssignMaster.findByIdAndUpdate(casesId, {
        $push: {
          remark: {
            text: remark,
            changedAt: new Date(),
            changedBy: userId,
          },
        },
        $set: { updatedAt: new Date() },
      });

      res.status(200).json({
        status: true,
        message: req.t("crud.created", { model: "Add Remark" }),
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
  public static async submitAssignedCases(req: Request, res: Response) {
    try {
      const { id: casesId } = req.body.validatedParamsData;
      let { alternateMobileNo, language, callbackDate, dispositionId } =
        req.body.validatedData;
      const userId = req.body.auth.user;

      console.log(callbackDate, "callbackDate  conversion");

      const isAdmin =
        req.body.auth?.roleId?.name == "Admin" ||
        req?.body?.auth?.roleId?.name == "Super_Admin"
          ? true
          : false;

      const caseData = await AssignMaster.findById(casesId);

      if (!caseData) {
        res.status(404).json({
          status: false,
          message: "Case not found",
        });
      }

      let dispositionData;

      if (dispositionId) {
        dispositionData = await Disposition.findById(dispositionId).lean();

        if (!dispositionData) {
          res.status(404).json({
            status: false,
            message: "Disposition not found",
          });
        }
      }

      // Check if the case is already closed
      if (caseData && caseData.status !== CaseStatusEnum.RECALL) {
        res.status(400).json({
          status: false,
          message: "Cannot add remark to a closed case",
        });
      }

      if (dispositionData?.toSubmit) {
        const checkTeleMer = await TeleMer.findOne({
          caseId: casesId,
          status: statusEnum.ACTIVE,
          deletedAt: null,
        });
        if (!checkTeleMer) {
          res.status(404).json({
            status: false,
            message: "TeleMer not found",
          });
        }
        await caseData?.updateStatus(
          CaseStatusEnum.SENT_TO_QC, // Replace with the appropriate status
          new Date(), // Current date as the changedAt value
          new Types.ObjectId(userId) // User ID as the changedBy value
        );
      }

      // Update the case with the new remark
      await AssignMaster.findByIdAndUpdate(casesId, {
        $set: {
          alternateMobileNo: isAdmin ? alternateMobileNo : null,
          language,
          callbackDate,
          updatedAt: new Date(),
        },
        $push: {
          dispositionId: {
            id: dispositionId,
            changedAt: new Date(),
            changedBy: userId,
          },
        },
      });

      // await AssignMaster.findByIdAndUpdate(casesId, {
      //   $set: {
      //     alternateMobileNo: isAdmin ? alternateMobileNo : null,
      //     language,
      //     callbackDate,
      //     dispositionId,
      //     updatedAt: new Date(),
      //   },
      // });

      if (caseData && dispositionData && dispositionData.toSubmit) {
        await caseData.updateStatus(
          CaseStatusEnum.SENT_TO_QC,
          new Date(),
          userId
        );
      }

      res.status(200).json({
        status: true,
        message: req.t("crud.created", { model: "Cases" }),
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
