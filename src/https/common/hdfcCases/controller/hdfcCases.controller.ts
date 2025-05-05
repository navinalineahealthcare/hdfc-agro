import { Request, Response } from "express";
import * as XLSX from "xlsx";
import { getFileBufferFromS3, parseExcelDate } from "../../../../utils/utils";
import HDFCCases from "../models/hdfcCases.model";

export class hdfcDumpCasesController {
  public static async dumpHDFCCases(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { xlsxFileKey } = req.body.validatedData;
      const buffer = await getFileBufferFromS3(xlsxFileKey);
      const workbook = XLSX.read(buffer, { type: "buffer" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // const mappedData = jsonData.map((row: any) => ({
      //   uniqueIdNum: row["UNIQUE ID NUM"]?.toString() || null,
      //   fromDate: row["FROM DATE"]?.toString() ?? null,
      //   toDate: row["TO DATE"]?.toString() ?? null,
      //   // createdDate: row["CREATED DATE"] ?? null,
      //   proposalNo: row["PROPOSALNO"]?.toString() || null,
      //   proposerName: row["PROPOSER NAME"] || null,
      //   insuredName: row["INSURED NAME"] || null,
      //   age: row["AGE"] || null,
      //   gender: row["GENDER"] || null,
      //   contactNo: row["CONTACTNO"]?.toString() || null,
      //   customerEmailId: row["CUSTOMER EMAIL ID"]?.toString().toLowerCase() || null,
      //   address: row["ADDRESS"] || null,
      //   city: row["CITY"] || null,
      //   state: row["STATE"] || null,
      //   pincode: row["PINCODE"]?.toString() || null,
      //   agentCode: row["AGENT CODE"]?.toString() || null,
      //   agentName: row["AGENT NAME"] || null,
      //   agentEmailId: row["AGENT EMAIL ID"]?.toString().toLowerCase() || null,
      //   agentMobile: row["AGENT MOBILE"]?.toString() || null,
      //   clientDob: row["CLIENT DOB"].toString() ?? null,
      //   sumInsured: row["SUM INSURED"] || null,
      //   premium: row["PREMIUM"] || null,
      //   portability: row["PORTABILITY"] || null,
      //   productName: row["PRODUCT NAME"] || null,
      //   productCode: row["PRODUCT CODE"]?.toString() || null,
      //   caseType: row["CASE TYPE"] || null,
      //   testCategory: row["TEST CATEGORY"] || null,
      //   tpaName: row["TPA NAME"] || null,
      //   tpaRemark: row["TPA REMARK"] || null,
      //   txtZone: row["TXT ZONE"] || null,
      // }));

      const mappedData = jsonData.map((row: any) => ({
        uniqueIdNum: row["UNIQUE ID NUM"]?.toString() || null,
        fromDate: parseExcelDate(row["FROM DATE"]),
        toDate: parseExcelDate(row["TO DATE"]),
        // createdDate: parseExcelDate(row["CREATED DATE"]),
        proposalNo: row["PROPOSALNO"]?.toString() || null,
        proposerName: row["PROPOSER NAME"] || null,
        insuredName: row["INSURED NAME"] || null,
        age: row["AGE"] || null,
        gender: row["GENDER"] || null,
        contactNo: row["CONTACTNO"]?.toString() || null,
        customerEmailId:
          row["CUSTOMER EMAIL ID"]?.toString().toLowerCase() || null,
        address: row["ADDRESS"] || null,
        city: row["CITY"] || null,
        state: row["STATE"] || null,
        pincode: row["PINCODE"]?.toString() || null,
        agentCode: row["AGENT CODE"]?.toString() || null,
        agentName: row["AGENT NAME"] || null,
        agentEmailId: row["AGENT EMAIL ID"]?.toString().toLowerCase() || null,
        agentMobile: row["AGENT MOBILE"]?.toString() || null,
        clientDob: parseExcelDate(row["CLIENT DOB"]),
        sumInsured: row["SUM INSURED"] || null,
        premium: row["PREMIUM"] || null,
        portability: row["PORTABILITY"] || null,
        productName: row["PRODUCT NAME"] || null,
        productCode: row["PRODUCT CODE"]?.toString() || null,
        caseType: row["CASE TYPE"] || null,
        testCategory: row["TEST CATEGORY"] || null,
        tpaName: row["TPA NAME"] || null,
        tpaRemark: row["TPA REMARK"] || null,
        txtZone: row["TXT ZONE"] || null,
      }));

      const mappedDataWithCreatedDate = await HDFCCases.insertMany(mappedData, {
        ordered: true,
      });

      res.status(200).json({
        status: true,
        data: mappedDataWithCreatedDate,
        message: "dump HDFC Cases successfully",
      });
    } catch (error) {
      console.error("Error importing Excel data:", error);
      res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }
}
