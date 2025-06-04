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

export default class qcDoctorController {
  public static async qcDoctorOpencaseList(req: Request, res: Response) {
    try {
      const { proposerName, productName, fromDate, toDate, search } =
        req.body.validatedQueryData || {};
      const { page = 1, perPage = 10 } = req.body.pagination || {};
      const { sortBy = "createdAt", sortType = "desc" } =
        req.body.validatedSortData || {};

      const isAdmin =
        req?.body?.auth?.roleId?.name == "Admin" ||
        req?.body?.auth?.roleId?.name == "Super_Admin"
          ? true
          : false;

      // Filter query
      const filterQuery: any = {
        ...(isAdmin ? {} : { qcDoctorId: req.body.auth.user }),
        status: CaseStatusEnum.SENT_TO_QC,
        deletedAt: null,
        qcDoctorId: null,
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
      const qcDoctorList = await AssignMaster.find(filterQuery)
        .select(
          "proposerName createdAt email insuredName mobileNo status proposalNo"
        )
        .populate({
          path: "doctorId",
          select: "firstName email",
        })
        .sort(sort)
        .skip(perPage * (page - 1))
        .limit(perPage);

      res.status(200).json({
        status: true,
        data: qcDoctorList,
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
  public static async qcDoctorAssignCase(req: Request, res: Response) {
    try {
      const { id: assignedToId } = req.body.validatedParamsData;
      const userId = req.body.auth.user;
      const { casesIds } = req.body.validatedData;

      // Check if assigned qcDoctor exists
      const assignedDataExists = await Admin.findById(assignedToId).lean();
      if (!assignedDataExists) {
        res.status(404).json({
          status: false,
          message: "Assigned qcDoctor not found",
        });
      }

      // Fetch only RECEIVED and active cases
      const validCases = await AssignMaster.find({
        _id: { $in: casesIds },
        status: CaseStatusEnum.SENT_TO_QC,
        deletedAt: null,
      }).lean();

      if (validCases.length === 0) {
        res.status(404).json({
          status: false,
          message: "No valid cases found with the provided IDs",
        });
      }

      // Insert new assignments
      await AssignMaster.updateMany(
        {
          _id: { $in: casesIds },
        },
        {
          $set: {
            qcDoctorId: new Types.ObjectId(assignedToId),
          },
        }
      );

      // Update the original cases' status to RECALL
      await HDFCCases.updateMany(
        { _id: { $in: validCases.map((c) => c._id) } },
        { $set: { status: CaseStatusEnum.SENT_TO_QC } }
      );

      res.status(200).json({
        status: true,
        message: "Cases assigned successfully",
      });
    } catch (error) {
      logger.error("Error in qcDoctorAssignCase:", error);
      res.status(500).json({
        status: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }
  public static async qcDoctorAssigncaseList(req: Request, res: Response) {
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
        ...(isAdmin ? {} : { qcDoctorId: req.body.auth.user }),
        status: CaseStatusEnum.SENT_TO_QC,
        qcDoctorId: { $ne: null },
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
      const qcDoctorList = await AssignMaster.find(filterQuery)
        .select(
          "requestDate requestId proposalNo proposerName insuredName mobileNo status email qcDoctorId alternateMobileNo language callbackDate remark callViaPhone dispositionId openCaseId"
        )
        .populate({
          path: "qcDoctorId",
          select: "firstName lastName email",
        })
        .populate({
          path: "dispositionId.id",
          select: "name description status",
        })
        .sort(sort)
        .skip(perPage * (page - 1))
        .limit(perPage);

      res.status(200).json({
        status: true,
        data: qcDoctorList,
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
  public static async qcDoctorList(req: Request, res: Response) {
    try {
      const role = await Role.find({
        name: { $in: ["DOCTOR", "QC"] },
        deletedAt: null,
      }).lean();

      if (!role) {
        res.status(404).json({
          status: false,
          message: "Role not found",
        });
      }

      const qcDoctorList = await Admin.find({
        roleId: { $in: role.map((item) => item._id) },
        status: statusEnum.ACTIVE,
        deletedAt: null,
      })
        .select("firstName lastName email")
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json({
        status: true,
        data: qcDoctorList,
        message: req.t("crud.list", { model: "Qc Doctor" }),
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error("Error in qcDoctorAssignCase: ", error);
        res.status(500).json({
          status: false,
          message: error.message,
        });
      } else {
        logger.error("Error in qcDoctorAssignCase: ", error);
        res.status(500).json({
          status: false,
          message: "An unknown error occurred",
        });
      }
    }
  }
  public static async approvedQCCases(req: Request, res: Response) {
    try {
      const { id: casesId } = req.body.validatedParamsData;
      let { dispositionId } = req.body.validatedData;
      const userId = req.body.auth.user;

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
      if (
        caseData &&
        (caseData.status === CaseStatusEnum.CLOSED ||
          caseData.status === CaseStatusEnum.QC_REJECTED)
      ) {
        res.status(400).json({
          status: false,
          message: "Cannot add remark to a closed case",
        });
      }

      // Update the case with the new remark
      await AssignMaster.findByIdAndUpdate(casesId, {
        $set: {
          status: CaseStatusEnum.CLOSED,
          updatedAt: new Date(),
        },
      });

      if (caseData && dispositionData && dispositionData.toSubmit) {
        await caseData.updateStatus(CaseStatusEnum.CLOSED, new Date(), userId);
      }

      res.status(200).json({
        status: true,
        message: req.t("crud.created", { model: "Cases" }),
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error("Error in qcDoctorAssignCase: ", error);
        res.status(500).json({
          status: false,
          message: error.message,
        });
      } else {
        logger.error("Error in qcDoctorAssignCase: ", error);
        res.status(500).json({
          status: false,
          message: "An unknown error occurred",
        });
      }
    }
  }
  public static async rejectQCCases(req: Request, res: Response) {
    try {
      const { id: casesId } = req.body.validatedParamsData;
      let { dispositionId } = req.body.validatedData;
      const userId = req.body.auth.user;

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
      if (caseData && caseData.status === CaseStatusEnum.QC_REJECTED) {
        res.status(400).json({
          status: false,
          message: "Cannot add remark to a closed case",
        });
        return;
      }

      // Update the case with the new remark
      // await AssignMaster.findByIdAndUpdate(casesId, {
      //   $set: {
      //     status: CaseStatusEnum.QC_REJECTED,
      //     updatedAt: new Date(),
      //     deletedAt: new Date(),
      //   },
      // });

      await AssignMaster.findByIdAndUpdate(casesId, {
        $set: {
          status: CaseStatusEnum.QC_REJECTED,
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
        $push: {
          dispositionId: {
            id: dispositionId, // Provide the new ObjectId
            changedAt: new Date(),
            changedBy: userId, // Current admin making the update
          },
        },
      });

      if (caseData) {
        await caseData.updateStatus(
          CaseStatusEnum.QC_REJECTED,
          new Date(),
          userId
        );
      }
      await HDFCCases.findByIdAndUpdate(
        {
          _id: caseData?.openCaseId,
        },
        {
          $set: {
            status: CaseStatusEnum.QC_REJECTED,
          },
        }
      );

      res.status(200).json({
        status: true,
        message: req.t("crud.Rectejed", { model: "Cases" }),
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error("Error in qcDoctorAssignCase: ", error);
        res.status(500).json({
          status: false,
          message: error.message,
        });
      } else {
        logger.error("Error in qcDoctorAssignCase: ", error);
        res.status(500).json({
          status: false,
          message: "An unknown error occurred",
        });
      }
    }
  }
}
