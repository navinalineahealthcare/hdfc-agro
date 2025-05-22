import { Request, Response } from "express";
import { TeleMer } from "../models/teleMer.model";
import { CaseStatusEnum, statusEnum } from "../../../common/enums";
import HDFCCases from "../../../common/hdfcCases/models/hdfcCases.model";
import { AssignMaster } from "../../doctor/models/assignMaster.model";

export default class qcTeleMerController {
  public static async qcTeleMerQuestionAnswerList(req: Request, res: Response) {
    console.log("Called...");
    try {
      const { id: proposalNo } = req.body.validatedParamsData;
      const { caseId } = req.body;

      const teleMerList = await TeleMer.find({
        proposalNo: proposalNo,
        caseId: caseId,
        deletedAt: null,
        status: statusEnum.ACTIVE,
      }).select("proposalNo teleMerData status caseId");

      if (!teleMerList) {
        res.status(404).json({
          status: false,
          message: req.t("crud.not_found", { model: "proposal data" }),
        });
      }

      res.status(200).json({
        status: true,
        data: teleMerList,
        message: req.t("crud.list", { model: "Tele Mer" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async qcTeleMerList(req: Request, res: Response) {
    try {
      const { id: proposalNo } = req.body.validatedParamsData;

      const teleMerdata = await AssignMaster.find({
        proposalNo: proposalNo,
        deletedAt: null,
        status: CaseStatusEnum.SENT_TO_QC,
      })
        .select(
          "-dispositionId -callbackDate -callViaPhone -remark -doctorId -status -email -history"
        )
        .populate({
          path: "openCaseId",
          select:
            "language address city state pincode age gender clientDob weight height bmi relationship educationQualification occupation",
          match: { deletedAt: null },
        })
        .lean();

      if (!teleMerdata) {
        res.status(404).json({
          status: false,
          message: req.t("crud.not_found", { model: "proposal data" }),
        });
      }

      let proposerDob: string | null = null;

      for (const doc of teleMerdata) {
        if (
          doc.insuredName?.trim().toLowerCase() ===
          doc.proposerName?.trim().toLowerCase()
        ) {
          // @ts-ignore
          proposerDob = doc?.openCaseId?.clientDob || null;
          break;
        }
      }
      // Step 2: Add proposerDob to each object
      const updatedData = teleMerdata.map((doc) => ({
        ...doc,
        proposerDob,
      }));

      res.status(200).json({
        status: true,
        data: updatedData,
        message: req.t("crud.list", { model: "Tele Mer" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async qcTeleMerConfirm(req: Request, res: Response) {
    try {
      const { proposalNo, data } = req.body.validatedData;
      const assignMasterData = await AssignMaster.find({
        proposalNo,
        deletedAt: null,
        status: CaseStatusEnum.SENT_TO_QC,
      }).lean();

      if (!assignMasterData || assignMasterData.length === 0) {
        res.status(404).json({
          status: false,
          message: req.t("crud.not_found", { model: "proposal data" }),
        });
      }

      const operations = data.map((item: any) =>
        Promise.all([
          TeleMer.findOneAndUpdate(
            {
              caseId: item._id,
              proposalNo,
            },
            {
              $set: {
                qcTeleMer: true,
                qcTeleMerData: item.questions,
              },
            }
          ),
          AssignMaster.findOneAndUpdate(
            { _id: item._id },
            {
              $set: {
                alternateMobileNo: item.alternateMobileNo,
                qcTeleMer: true,
                updatedAt: new Date(),
              },
            }
          ),

          HDFCCases.findOneAndUpdate(
            {
              _id: item.openCaseId._id,
              proposalNo,
            },
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
