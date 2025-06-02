import { Request, Response } from "express";
import { AssignMaster } from "../../../admin/doctor/models/assignMaster.model";
import { pagination } from "../../../../utils/utils";
import { salesCaseListResponse } from "../responses/dashboard.response";
import { CaseStatusEnum } from "../../../common/enums";
import HDFCCases from "../../../common/hdfcCases/models/hdfcCases.model";

class dashboardcasesController {
  public static async dashboardSalesCasesList(req: Request, res: Response) {
    try {
      const { proposerName, productName, fromDate, toDate, search } =
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
            from: "assign_masters", // Adjust based on your collection name
            localField: "_id",
            foreignField: "openCaseId",
            as: "openCaseDetails",
          },
        },
        {
          $sort: sortStage,
        },
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
                  status: {
                    $arrayElemAt: ["$openCaseDetails.status", 0], // status from first openCaseDetails
                  },
                  openCaseDetails: 1,
                  testCategory: 1,
                  productName: 1,
                  caseType: 1,
                  tatInDays: {
                    $round: [
                      {
                        $divide: [
                          {
                            $subtract: [
                              {
                                $ifNull: [
                                  {
                                    $arrayElemAt: [
                                      "$openCaseDetails.updatedAt",
                                      0,
                                    ],
                                  },
                                  new Date(), // fallback to now if no updatedAt
                                ],
                              },
                              "$createdAt",
                            ],
                          },
                          1000 * 60 * 60 * 24, // milliseconds → days
                        ],
                      },
                      1, // round to nearest whole day
                    ],
                  },
                },
              },

              // {
              //   $project: {
              //     createdAt: 1,
              //     requestId: 1,
              //     proposalNo: 1,
              //     proposerName: 1,
              //     agentName: 1,
              //     insuredName: 1,
              //     contactNo: 1,
              //     tpaName: 1,
              //     customerEmailId: 1,
              //     status: 1,
              //     testCategory: 1,
              //     productName: 1,
              //     openCaseDetails: 1,
              //     caseType: 1,
              //   },
              // },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      console.log(JSON.stringify(pipeline), "-------");

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
}

export default dashboardcasesController;
