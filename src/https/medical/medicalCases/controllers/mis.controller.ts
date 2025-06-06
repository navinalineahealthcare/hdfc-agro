import { Request, Response } from "express";
import { AssignMaster } from "../../../admin/doctor/models/assignMaster.model";
import ExcelJS from "exceljs";
import _ from "lodash";
class misCasesController {
  public static async misCasesExport(req: Request, res: Response) {
    try {
      const {
        search = "",
        fromDate,
        toDate,
      } = req.body.validatedQueryData || {};

      const filter: any = { deletedAt: null };

      if (search && typeof search === "string" && search.trim() !== "") {
        filter.$or = [
          { proposerName: { $regex: new RegExp(search, "i") } },
          { insuredName: { $regex: new RegExp(search, "i") } },
          { proposalNo: { $regex: new RegExp(search, "i") } },
        ];
      }

      if (fromDate && toDate) {
        filter.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        };
      }

      const assignCases = await AssignMaster.find(filter)
        .populate("openCaseId")
        .populate("dispositionId") // Ensure this is in your schema as a ref
        .sort({ createdAt: -1 })
        .lean();

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Assign Cases");

      // Dynamically build columns from keys
      const sample = assignCases[0] || {};
      worksheet.columns = Object.keys(sample).map((key) => ({
        header: _.startCase(key), // Makes headers readable
        key,
        width: 25,
      }));

      // Add all rows
      assignCases.forEach((row) => {
        worksheet.addRow(row);
      });

      // Set headers for download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=assign_cases.xlsx"
      );

      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error: any) {
      console.error("Error in misCasesExport:", error);
      res.status(500).json({
        status: false,
        message: "Failed to export assign cases. Please try again.",
      });
    }
  }

  // public static async misCasesExport(req: Request, res: Response) {
  //   try {
  //     const {
  //       search = "",
  //       fromDate,
  //       toDate,
  //     } = req.body.validatedQueryData || {};

  //     const filter: any = { deletedAt: null };

  //     if (search && typeof search === "string" && search.trim() !== "") {
  //       filter.$or = [
  //         { proposerName: { $regex: new RegExp(search, "i") } },
  //         { insuredName: { $regex: new RegExp(search, "i") } },
  //         { proposalNo: { $regex: new RegExp(search, "i") } },
  //       ];
  //     }

  //     if (fromDate && toDate) {
  //       filter.createdAt = {
  //         $gte: new Date(fromDate),
  //         $lte: new Date(toDate),
  //       };
  //     }

  //     const assignCases = await AssignMaster.find(filter)
  //       .populate("openCaseId")
  //       .sort({ createdAt: -1 })
  //       .lean();

  //     return res.status(200).json({
  //       status: true,
  //       data: assignCases,
  //       message: req.t("assigncases.export"),
  //     });

  //     // Initialize workbook and worksheet
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet("Assign Cases");

  //     // Add headers
  //     worksheet.columns = [
  //       { header: "Proposal No", key: "proposalNo", width: 20 },
  //       { header: "Proposer Name", key: "proposerName", width: 30 },
  //       { header: "Insured Name", key: "insuredName", width: 30 },
  //       { header: "Assigned At", key: "createdAt", width: 25 },
  //     ];

  //     // Add data rows
  //     assignCases.forEach((item) => {
  //       worksheet.addRow({
  //         proposalNo: item.proposalNo || "",
  //         proposerName: item.proposerName || "",
  //         insuredName: item.insuredName || "",
  //         createdAt: item.createdAt
  //           ? new Date(item.createdAt).toLocaleString()
  //           : "",
  //       });
  //     });

  //     // Set response headers for Excel download
  //     res.setHeader(
  //       "Content-Type",
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //     );
  //     res.setHeader(
  //       "Content-Disposition",
  //       `attachment; filename=$MISDetails${new Date()}.xlsx`
  //     );

  //     await workbook.xlsx.write(res);
  //     res.status(200).end();
  //   } catch (error: any) {
  //     console.error("Error in misCasesExport:", error);
  //     res.status(500).json({
  //       status: false,
  //       message: "Failed to export assign cases. Please try again.",
  //     });
  //   }
  // }
}

export default misCasesController;
