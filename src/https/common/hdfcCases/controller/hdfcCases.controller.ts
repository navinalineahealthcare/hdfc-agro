import { Request, Response } from "express";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export class hdfcDumpCasesController {
  public static async dumpHDFCCases(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ status: false, message: "No file uploaded" });
        return;
      }

      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const mappedData = jsonData.map((row: any) => ({
        uniqueIdNum: row["UNIQUE ID NUM"]?.toString() || null,
        fromDate: row["FROM DATE"] ? new Date(row["FROM DATE"]) : null,
        toDate: row["TO DATE"] ? new Date(row["TO DATE"]) : null,
        createdDate: row["CREATED DATE"] ? new Date(row["CREATED DATE"]) : null,
        proposalNo: row["PROPOSALNO"]?.toString() || null,
        proposerName: row["PROPOSER NAME"] || null,
        insuredName: row["INSURED NAME"] || null,
        age: row["AGE"] || null,
        gender: row["GENDER"] || null,
        contactNo: row["CONTACTNO"]?.toString() || null,
        customerEmailId: row["CUSTOMER EMAIL ID"] || null,
        address: row["ADDRESS"] || null,
        city: row["CITY"] || null,
        state: row["STATE"] || null,
        pincode: row["PINCODE"]?.toString() || null,
        agentCode: row["AGENT CODE"]?.toString() || null,
        agentName: row["AGENT NAME"] || null,
        agentEmailId: row["AGENT EMAIL ID"] || null,
        agentMobile: row["AGENT MOBILE"]?.toString() || null,
        clientDob: row["CLIENT DOB"] ? new Date(row["CLIENT DOB"]) : null,
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

      console.log(mappedData);
      
      // await UserData.insertMany(mappedData);

      fs.unlinkSync(req.file.path); // cleanup uploaded file

      res.status(200).json({
        status: true,
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
