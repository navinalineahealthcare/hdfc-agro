import { Request, Response } from "express";
import { AssignMaster } from "../../doctor/models/assignMaster.model";
import { CaseStatusEnum } from "../../../common/enums";
import HDFCCases from "../../../common/hdfcCases/models/hdfcCases.model";
import { TeleMer } from "../models/teleMer.model";
import mongoose from "mongoose";

export default class teleMerController {
  public static async teleMerlist(req: Request, res: Response) {
    try {
      const { id: proposalNo } = req.body.validatedParamsData;
      const teleMerdata = await AssignMaster.find({
        proposalNo: proposalNo,
        deletedAt: null,
        status: CaseStatusEnum.RECALL,
      })
        .select(
          "-dispositionId -callbackDate -callViaPhone -remark -doctorId -status -email -history"
        )
        .populate({
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
        message: req.t("crud.list", { model: "Tele Mer" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
  //   public static async teleMerCreated(req: Request, res: Response) {
  //     try {
  //       let { proposalNo, data } = req.body.validatedData;

  //       const AssignMasterData = await AssignMaster.find({
  //         proposalNo: proposalNo,
  //         deletedAt: null,
  //         status: CaseStatusEnum.RECALL,
  //       });

  //       if (!AssignMasterData || AssignMasterData.length === 0) {
  //         res.status(404).json({
  //           status: false,
  //           message: req.t("crud.not_found", { model: "proposal data" }),
  //         });
  //       }

  //       data.forEach(async (item: any) => {
  //         await TeleMer.create({
  //           proposalNo: proposalNo,
  //           teleMerData: item.questions,
  //           caseId: item._id,
  //         });
  //         await AssignMaster.findOneAndUpdate(
  //           {
  //             _id: item._id,
  //           },
  //           {
  //             $set: {
  //               alternateMobileNo: item.alternateMobileNo,
  //               updatedAt: new Date(),
  //             },
  //           },
  //           {
  //             new: true,
  //           }
  //         );
  //         await HDFCCases.findOneAndUpdate(
  //           { proposalNo: proposalNo },
  //           {
  //             $set: {
  //               weight: item.openCaseId.weight,
  //               height: item.openCaseId.height,
  //               bmi: item.openCaseId.bmi,
  //               relationship: item.openCaseId.relationship,
  //               occupation: item.openCaseId.occupation,
  //               gender: item.openCaseId.gender.toString().charAt(0).toUpperCase(),
  //               educationQualification: item.openCaseId.educationQualification,
  //               updatedAt: new Date(),
  //             },
  //           },
  //           {
  //             new: true,
  //           }
  //         );
  //       });

  //       if (true) {
  //         res.status(404).json({
  //           status: false,
  //           message: req.t("crud.not_found", { model: "proposal data" }),
  //         });
  //       }

  //       res.status(200).json({
  //         status: true,
  //         data: "teleMerdata",
  //         message: req.t("crud.list", { model: "Tele Mer" }),
  //       });
  //     } catch (error: any) {
  //       res.status(500).json({
  //         status: false,
  //         message: error.message,
  //       });
  //     }
  //   }

  /**
   * @description Create TeleMer data
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} - Returns a response with the status and message
   */

  public static async teleMerCreated(req: Request, res: Response) {
    try {
      const { proposalNo, data } = req.body.validatedData;

      const assignMasterData = await AssignMaster.find({
        proposalNo,
        deletedAt: null,
        status: CaseStatusEnum.RECALL,
      });

      if (!assignMasterData || assignMasterData.length === 0) {
        res.status(404).json({
          status: false,
          message: req.t("crud.not_found", { model: "proposal data" }),
        });
      }

      console.log(data, "------", data.length, "------", data[0]._id);
      
      const operations = data.map((item: any) =>
        Promise.all([
          TeleMer.create({
            proposalNo,
            teleMerData: item.questions,
            caseId: item._id,
          }),
          AssignMaster.findOneAndUpdate(
            { _id: item._id },
            {
              $set: {
                alternateMobileNo: item.alternateMobileNo,
                updatedAt: new Date(),
              },
            }
          ),
          HDFCCases.findOneAndUpdate(
            { proposalNo },
            {
              $set: {
                weight: item.openCaseId.weight,
                height: item.openCaseId.height,
                bmi: item.openCaseId.bmi,
                relationship: item.openCaseId.relationship,
                occupation: item.openCaseId.occupation,
                gender: item.openCaseId.gender?.charAt(0).toUpperCase(),
                educationQualification: item.openCaseId.educationQualification,
                updatedAt: new Date(),
              },
            }
          ),
        ])
      );

      await Promise.all(operations);

      res.status(200).json({
        status: true,
        data: "Tele MER data saved",
        message: req.t("crud.list", { model: "Tele Mer" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message || "Internal server error",
      });
    }
  }
}
