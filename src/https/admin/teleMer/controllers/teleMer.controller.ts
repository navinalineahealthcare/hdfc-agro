import { Request, Response } from "express";
import { CaseStatusEnum, rolesEnum, statusEnum } from "../../../common/enums";
import HDFCCases from "../../../common/hdfcCases/models/hdfcCases.model";
import { AssignMaster } from "../../doctor/models/assignMaster.model";
import { TeleMer } from "../models/teleMer.model";
import PdfPrinter from "pdfmake";
import path from "path";
import fs from "fs";
import getStream from "get-stream";

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
        console.log(
          doc.insuredName?.trim().toLowerCase() ===
            doc.proposerName?.trim().toLowerCase(),
          "===========>>>>>>>>>>>>>>>>>>",
          doc.insuredName,
          doc.proposerName
        );
        if (
          doc.insuredName?.trim().toLowerCase() ===
          doc.proposerName?.trim().toLowerCase()
        ) {
          // @ts-ignore
          proposerDob = doc?.openCaseId?.clientDob || null;
          break;
        }
      }
      console.log(proposerDob);
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

  public static async teleMerUnlink(req: Request, res: Response) {
    try {
      const { id: openCaseId } = req.body.validatedParamsData;
      const { type } = req?.body;

      const setQuery = {
        ...(type === rolesEnum.QC
          ? { qcDoctorId: null }
          : { doctorId: null, status: CaseStatusEnum.RECEIVED }),
      };

      if (!openCaseId) {
        res.status(400).json({
          status: false,
          message: req.t("mer.invalid_case_id"),
        });
        return;
      }

      await AssignMaster.updateOne(
        { openCaseId: openCaseId },
        {
          $set: setQuery,
        }
      );
      type !== rolesEnum.QC &&
        (await HDFCCases.updateOne(
          {
            _id: openCaseId,
          },
          {
            $set: {
              status: CaseStatusEnum.RECEIVED,
            },
          }
        ));

      res.status(200).json({
        status: true,
        message: req.t("mer.unlink_mer_success"),
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: req.t("common.internal_server_error") || error.message,
      });
      return;
    }
  }

  // public static async teleMerCreated(req: Request, res: Response) {
  //   try {
  //     let { proposalNo, data } = req.body.validatedData;

  //     const AssignMasterData = await AssignMaster.find({
  //       proposalNo: proposalNo,
  //       deletedAt: null,
  //       status: CaseStatusEnum.RECALL,
  //     });

  //     if (!AssignMasterData || AssignMasterData.length === 0) {
  //       res.status(404).json({
  //         status: false,
  //         message: req.t("crud.not_found", { model: "proposal data" }),
  //       });
  //     }

  //     data.forEach(async (item: any) => {
  //       await TeleMer.create({
  //         proposalNo: proposalNo,
  //         teleMerData: item.questions,
  //         caseId: item._id,
  //       });
  //       await AssignMaster.findOneAndUpdate(
  //         {
  //           _id: item._id,
  //         },
  //         {
  //           $set: {
  //             alternateMobileNo: item.alternateMobileNo,
  //             updatedAt: new Date(),
  //           },
  //         },
  //         {
  //           new: true,
  //         }
  //       );
  //       await HDFCCases.findOneAndUpdate(
  //         { proposalNo: proposalNo },
  //         {
  //           $set: {
  //             weight: item.openCaseId.weight,
  //             height: item.openCaseId.height,
  //             bmi: item.openCaseId.bmi,
  //             relationship: item.openCaseId.relationship,
  //             occupation: item.openCaseId.occupation,
  //             gender: item.openCaseId.gender.toString().charAt(0).toUpperCase(),
  //             educationQualification: item.openCaseId.educationQualification,
  //             updatedAt: new Date(),
  //           },
  //         },
  //         {
  //           new: true,
  //         }
  //       );
  //     });

  //     if (true) {
  //       res.status(404).json({
  //         status: false,
  //         message: req.t("crud.not_found", { model: "proposal data" }),
  //       });
  //     }

  //     res.status(200).json({
  //       status: true,
  //       data: "teleMerdata",
  //       message: req.t("crud.list", { model: "Tele Mer" }),
  //     });
  //   } catch (error: any) {
  //     res.status(500).json({
  //       status: false,
  //       message: error.message,
  //     });
  //   }
  // }

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
      }).lean();

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
                isTeleMer: true,
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

  public static async teleMerPdfConvert(
    caseId: string,
    req: Request,
    res: Response
  ) {
    // const { id: caseId } = req.body.validatedParamsData;

    try {
      const teleMerData = await TeleMer.find({
        deletedAt: null,
        caseId,
      }).select("qcTeleMerData");

      const userData = await AssignMaster.find({
        _id: caseId,
        deletedAt: null,
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
      const paragraphHeader =
        "Transcript of the Telephonic Medical Examination Report";
      const paragraph = `
      This is the transcript of the answers provided by Life to be insured verbally to the questions asked below in a telephonic verification by the underwriter of HDFC Ergo General Insurance-. The answers provided by the Life to be insured would form a part of the application for insurance. The company has accepted the answers provided in utmost good faith and thereby issued the policy. The Company reserves the rights to repudiate any claim arising out of this policy in the event of any mis-statement or suppression of material information found either in the said verification or in the application form.
We request you to go through the transcript carefully. In case of any disagreement, you are requested to highlight the same within 15 days of the receipt of this transcript; otherwise this would be taken as acceptable to you and thereby binding on you. Please retain this transcript for future reference.
      `;

      const leftLogoPath = path.join(
        __dirname,
        "../../../../../public/Assets/Image/hdfc-ergo-logo.jpg"
      );
      const rightLogoPath = path.join(
        __dirname,
        "../../../../../public/Assets/Image/life-connect.png"
      );
      const leftLogoBase64 = fs.readFileSync(leftLogoPath).toString("base64");
      const rightLogoBase64 = fs.readFileSync(rightLogoPath).toString("base64");

      // Add the image prefix
      const leftLogoDataUrl = `data:image/png;base64,${leftLogoBase64}`;
      const rightLogoDataUrl = `data:image/png;base64,${rightLogoBase64}`;

      generatePdf(
        userData,
        teleMerData,
        paragraphHeader,
        paragraph,
        res,
        leftLogoDataUrl,
        rightLogoDataUrl
      );
    } catch (error) {
      console.error("PDF generation error:", error);
      throw new Error(`PDF generation failed: ${error || "Unknown error"}`);
    }
  }
}

import type { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import { PassThrough } from "stream";
import { internalUploadToS3 } from "../../../../utils/utils";
import { t } from "i18next";

async function generatePdf(
  userData: any,
  teleMerData: any,
  paragraphHeader: string,
  paragraphText: string,
  res: any,
  leftLogoDataUrl: any,
  rightLogoDataUrl: any
) {
  try {
    // Extract first object (if it's an array)
    const user = userData[0];
    const openCase = user.openCaseId || {};
    const qcTeleMerArray = (teleMerData[0] || {}).qcTeleMerData || [];

    // ✅ Prepare Table 1: From userData and openCaseId
    const table1Body = [
      [
        { text: "Proposal No", bold: true },
        user.proposalNo || "",
        { text: "Date", bold: true },
        user.requestDate || "",
      ],
      [
        { text: "Proposer Name", bold: true },
        user.proposerName || "",
        { text: "DOB of Proposer", bold: true },
        user.language || "",
      ],
      [
        { text: "Member Name", bold: true },
        user.insuredName || "",
        { text: "DOB of Member", bold: true },
        openCase.clientDob || "",
      ],
      [
        { text: "Relationship to Proposer", bold: true },
        openCase.relationship || "",
        { text: "Gender", bold: true },
        openCase.gender || "",
      ],
      [
        { text: "Mobile No", bold: true },
        user.mobileNo || "",
        { text: "Alternate No", bold: true },
        user.alternateMobileNo || "",
      ],
      [
        { text: "Height", bold: true },
        openCase.height || "",
        { text: "Weight", bold: true },
        openCase.weight || "",
      ],

      [
        { text: "BMI", bold: true },
        openCase.bmi || "",
        { text: "Location", bold: true },
        openCase.address || "",
      ],
      [
        { text: "Educational qualification", bold: true },
        openCase.educationQualification || "",
        { text: "Occupation Details", bold: true },
        openCase.occupation || "",
      ],
    ];

    // ✅ Prepare Table 2: From qcTeleMerData array
    const table2Body: any[][] = [];

    function formatSubQuestions(subQuestions: any[] = []): any {
      if (!Array.isArray(subQuestions) || subQuestions.length === 0) return "";

      return {
        stack: subQuestions
          .map((q, idx) => [
            { text: `${idx + 1}. ${q.text}`, bold: true },
            { text: `- ${q.answer}`, margin: [0, 0, 0, 5] },
          ])
          .flat(),
        margin: [0, 2, 0, 2],
      };
    }

    if (qcTeleMerArray.length > 0) {
      const excludeKeys = ["_id", "isOnlyFemale", "agree", "subQuestions"];

      // 1. Prepare headers once
      const headers = Object.keys(qcTeleMerArray[0])
        .filter((key) => !excludeKeys.includes(key))
        .concat("subQuestions");
      // 2. Push header row
      console.log(":: headers.length >>", headers.length);
      console.log(":: table2Body.length >>", table2Body.length);
      if (!table2Body.length) {
        table2Body.push(headers.map((key) => ({ text: key, bold: true })));
      }

      // 3. Push each data row
      qcTeleMerArray.forEach((item: any) => {
        const row = headers.map((key) => {
          if (key === "subQuestions") {
            return formatSubQuestions(item.subQuestions);
          }

          const value = item[key];
          return typeof value === "object" ? JSON.stringify(value) : value;
        });

        table2Body.push(row);
      });
    }

    const colCount = table2Body[0]?.length || 1;
    const widths = Array(colCount).fill("auto");
    if (colCount > 1) widths[colCount - 1] = "*";

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          columns: [
            {
              image: leftLogoDataUrl, // Left logo
              width: 100,
              alignment: "left",
            },
            {
              text: "", // this is an invisible spacer
              width: "*",
            },
            {
              image: rightLogoDataUrl, // Right logo
              width: 100,
              margin: [0, 30, 0, 0],
              alignment: "right",
            },
          ],
          margin: [0, 0, 0, 20], // Add spacing below the logos
        },
        {
          text: paragraphHeader,
          style: "header",
          alignment: "center",
        } as Content,
        { text: paragraphText, margin: [0, 0, 0, 20] } as Content,
        { text: "User Details Table", style: "header" } as Content,
        {
          table: {
            headerRows: 0,
            widths: ["20%", "30%", "20%", "30%"], // adjust as needed
            body: table1Body,
          },
          // layout: "lightHorizontalLines", // this adds proper borders
          margin: [0, 0, 0, 20],
          style: "tableCell",
        } as Content,

        {
          text: "TeleMer Data Table",
          style: "header",
          margin: [0, 10, 0, 5],
        } as Content,

        {
          table: {
            headerRows: 0,
            widths: ["7%", "20%", "20%", "*"],
            body: table2Body.length ? table2Body : [["No data available"]],
          },
          // layout: "lightHorizontalLines",
          // pageBreak: "before",
          margin: [0, 5, 0, 20],
          style: "tableCell",
        } as Content,
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 10],
        },
        tableCell: {
          fontSize: 10,
          margin: [2, 2, 2, 2],
        },
      },
    };

    const fonts = {
      Roboto: {
        normal: path.resolve(__dirname, "../fonts/Roboto-Regular.ttf"),
        bold: path.resolve(__dirname, "../fonts/Roboto-Bold.ttf"),
        italics: path.resolve(__dirname, "../fonts/Roboto-Italic.ttf"),
        bolditalics: path.resolve(__dirname, "../fonts/Roboto-BoldItalic.ttf"),
      },
    };
    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    const passThrough = new PassThrough();
    pdfDoc.pipe(passThrough);
    pdfDoc.end();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    passThrough.pipe(res);

    const buffer = await getStream.buffer(passThrough);

    const responseUrl = await internalUploadToS3({
      fileBuffer: buffer,
      fileName: `report-${Date.now()}.pdf`,
      mimeType: "application/pdf",
      requestId: user?.requestId,
      destinationUrl: "hdfc",
    });

    console.log({ responseUrl });

    // await AssignMaster.findOneAndUpdate(
    //   { _id: user._id },
    //   {
    //     $set: {
    //       tranScriptUrl: responseUrl,
    //       updatedAt: new Date(),
    //     },
    //   }
    // );

    return responseUrl;
  } catch (error: any) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}
