import { Request, Response } from "express";
import { AssignMaster } from "../../../admin/doctor/models/assignMaster.model";
import { pagination } from "../../../../utils/utils";
import { salesCaseListResponse } from "../responses/dashboard.response";
import { CaseStatusEnum } from "../../../common/enums";
import HDFCCases from "../../../common/hdfcCases/models/hdfcCases.model";

class dashboardMedicalController {
  /**
   * Fetches a list of dashboard sales cases with pagination and filtering options.
   * @param req - The request object containing query parameters and pagination data.
   * @param res - The response object to send the result back to the client.
   */
  public static async dashboardMedicalCasesList(req: Request, res: Response) {
    try {
      const { proposerName, productName, fromDate, tpaName, toDate, search } =
        req.body.validatedQueryData || {};
      const { page = 1, perPage = 10 } = req.body.pagination || {};
      const { sortBy = "createdAt", sortType = "desc" } =
        req.body.validatedSortData || {};

      const skip = (page - 1) * perPage;

      const matchStage: any = {
        deletedAt: null,
      };

      if (proposerName) {
        matchStage.proposerName = { $regex: new RegExp(proposerName, "i") };
      }

      if (productName) {
        matchStage.productName = { $regex: new RegExp(productName, "i") };
      }
      if (tpaName) {
        matchStage.tpaName = { $regex: new RegExp(tpaName, "i") };
      }

      if (search && typeof search === "string" && search.trim() !== "") {
        matchStage.$or = [
          { proposerName: { $regex: new RegExp(search, "i") } },
          { proposalNo: { $regex: new RegExp(search, "i") } },
          { productName: { $regex: new RegExp(search, "i") } },
          { caseId: { $regex: new RegExp(search, "i") } },
        ];
      }

      if (fromDate && toDate) {
        matchStage.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(new Date(toDate).setUTCHours(23, 59, 59)),
        };
      }

      const sortStage: any = {
        [sortBy]: sortType === "asc" ? 1 : -1,
        requestId: -1,
      };

      const pipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: "assign_masters",
            localField: "_id",
            foreignField: "openCaseId",
            as: "openCaseDetails",
          },
        },
        {
          $unwind: {
            path: "$openCaseDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            safeHistory: { $ifNull: ["$openCaseDetails.history", []] },
          },
        },
        {
          $addFields: {
            closedHistory: {
              $filter: {
                input: "$safeHistory",
                as: "h",
                cond: { $eq: ["$$h.newStatus", "Closed"] },
              },
            },
          },
        },
        {
          $addFields: {
            closedDate: {
              $cond: [
                { $gt: [{ $size: "$closedHistory" }, 0] },
                { $arrayElemAt: ["$closedHistory.changedAt", 0] },
                new Date(),
              ],
            },
          },
        },
        {
          $addFields: {
            tatInDays: {
              $round: [
                {
                  $divide: [
                    { $subtract: ["$closedDate", "$createdAt"] },
                    1000 * 60 * 60 * 24,
                  ],
                },
                1,
              ],
            },
          },
        },
        { $sort: sortStage },
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: perPage },
              {
                $project: {
                  createdAt: 1,
                  requestId: 1,
                  proposalNo: 1,
                  proposerName: 1,
                  agentName: 1,
                  insuredName: 1,
                  contactNo: 1,
                  tpaName: 1,
                  customerEmailId: 1,
                  status: { $ifNull: ["$openCaseDetails.status", "$status"] },
                  // openCaseDetails: 1,
                  testCategory: 1,
                  productName: 1,
                  caseType: 1,
                  tatInDays: 1,
                },
              },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const result = await HDFCCases.aggregate(pipeline);
      const doctorList = result[0]?.data || [];
      const totalCount = result[0]?.totalCount[0]?.count || 0;

      res.status(200).json({
        status: true,
        data: doctorList,
        pagination: pagination(totalCount, perPage, page),
        message: req.t("crud.list", { model: "Dashboard Case" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
  /**
   * Fetches a list of proposal cases for the dashboard.
   * @param req - The request object containing validated parameters.
   * @param res - The response object to send the result back to the client.
   */

  public static async dashboardMedicalCasesProposalList(
    req: Request,
    res: Response
  ) {
    try {
      const { id: casesId } = req.body.validatedParamsData;
      console.log(casesId, "----------");
      const casesData = await HDFCCases.findById(casesId).lean();
      if (!casesData) {
        res.status(404).json({
          status: false,
          message: req.t("crud.not_found", { model: "Proposal Case" }),
        });
        return;
      }

      const matchStage: any = {
        deletedAt: null,
        proposalNo: casesData.proposalNo,
      };
      const sortStage: any = {
        requestId: -1,
      };

      const pipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: "assign_masters",
            localField: "_id",
            foreignField: "openCaseId",
            as: "openCaseDetails",
          },
        },
        {
          $unwind: {
            path: "$openCaseDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            safeHistory: { $ifNull: ["$openCaseDetails.history", []] },
          },
        },
        {
          $addFields: {
            closedHistory: {
              $filter: {
                input: "$safeHistory",
                as: "h",
                cond: { $eq: ["$$h.newStatus", "Closed"] },
              },
            },
          },
        },
        {
          $addFields: {
            closedDate: {
              $cond: [
                { $gt: [{ $size: "$closedHistory" }, 0] },
                { $arrayElemAt: ["$closedHistory.changedAt", 0] },
                new Date(),
              ],
            },
          },
        },
        {
          $addFields: {
            tatInDays: {
              $round: [
                {
                  $divide: [
                    { $subtract: ["$closedDate", "$createdAt"] },
                    1000 * 60 * 60 * 24,
                  ],
                },
                1,
              ],
            },
          },
        },
        { $sort: sortStage },
        {
          $facet: {
            data: [
              {
                $project: {
                  createdAt: 1,
                  requestId: 1,
                  proposalNo: 1,
                  proposerName: 1,
                  agentName: 1,
                  insuredName: 1,
                  contactNo: 1,
                  tpaName: 1,
                  customerEmailId: 1,
                  status: { $ifNull: ["$openCaseDetails.status", "$status"] },
                  // openCaseDetails: 1,
                  testCategory: 1,
                  productName: 1,
                  caseType: 1,
                  tatInDays: 1,
                },
              },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const result = await HDFCCases.aggregate(pipeline);
      const doctorList = result[0]?.data || [];

      res.status(200).json({
        status: true,
        data: doctorList,

        message: req.t("crud.list", { model: "Proposal Case List" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
/**
   * Fetches detailed information about a specific medical case.
   * @param req - The request object containing validated parameters.
   * @param res - The response object to send the result back to the client.
   */

  public static async dashboardMedicalCasesDetails(
    req: Request,
    res: Response
  ) {
    try {
      const { id: casesId } = req.body.validatedParamsData;

      const casesData = await HDFCCases.findById(casesId).lean();
      if (!casesData) {
        res.status(404).json({
          status: false,
          message: req.t("crud.not_found", { model: "Proposal Case" }),
        });
        return;
      }

      const pipeline = [
        {
          $match: {
            deletedAt: null,
            _id: casesData._id,
          },
        },
        {
          $lookup: {
            from: "assign_masters",
            localField: "_id",
            foreignField: "openCaseId",
            as: "openCaseDetails",
          },
        },
        {
          $unwind: "$openCaseDetails",
        },
        {
          $lookup: {
            from: "dispositions",
            let: {
              dispositionIds: {
                $ifNull: ["$openCaseDetails.dispositionId.id", []],
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$dispositionIds"],
                  },
                },
              },
            ],
            as: "dispositionDetails",
          },
        },
        {
          $addFields: {
            disposition: {
              $cond: [
                {
                  $gt: [
                    {
                      $size: {
                        $ifNull: ["$openCaseDetails.dispositionId", []],
                      },
                    },
                    0,
                  ],
                },
                {
                  $map: {
                    input: "$openCaseDetails.dispositionId",
                    as: "item",
                    in: {
                      id: "$$item.id",
                      changedAt: "$$item.changedAt",
                      changedBy: "$$item.changedBy",
                      name: {
                        $arrayElemAt: [
                          {
                            $map: {
                              input: {
                                $filter: {
                                  input: "$dispositionDetails",
                                  as: "disp",
                                  cond: { $eq: ["$$disp._id", "$$item.id"] },
                                },
                              },
                              as: "matched",
                              in: "$$matched.name",
                            },
                          },
                          0,
                        ],
                      },
                    },
                  },
                },
                [],
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            proposerName: 1,
            age: 1,
            gender: 1,
            sumInsured: 1,
            productName: 1,
            clientDob: 1,
            contactNo: 1,
            address: 1,
            insuredName: 1,
            customerEmailId: 1,
            status: 1,
            agent: {
              agentName: "$agentName",
              agentCode: "$agentCode",
              agentEmailId: "$agentEmailId",
              agentMobile: "$agentMobile",
            },
            history: "$openCaseDetails.history",
            disposition: 1,
          },
        },
      ];

      const [caseDetail] = await HDFCCases.aggregate(pipeline);

      res.status(200).json({
        status: true,
        data: caseDetail || null,
        message: req.t("crud.list", { model: "Proposal Case List" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
      return;
    }
  }
}

export default dashboardMedicalController;
