import { Request, Response } from "express";
import { Disposition } from "../models/disposition.modal";
import { pagination } from "../../../../utils/utils";

export class dispositionController {
  public static async dispositionList(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { page = 1, perPage = 35 } = req.body.pagination || {};
      const { sortBy = "createdAt", sortType = "desc" } =
        req.body.validatedSortData || {};
      const { search } = req.body.validatedQueryData || {};

      const filterQuery: any = {
        deletedAt: null,
        status: "ACTIVE",
      };
      if (search && typeof search === "string" && search.trim() !== "") {
        filterQuery.$or = [
          { name: { $regex: new RegExp(search, "i") } },
          { description: { $regex: new RegExp(search, "i") } },
        ];
      }

      const sort: any = {
        [sortBy]: sortType === "asc" ? 1 : -1,
      };
      // Count total documents
      const totalCount = await Disposition.find(filterQuery)
        .countDocuments()
        .exec();
      const dispositionList = await Disposition.find(filterQuery)
        .select("name description status")
        .sort(sort)
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();

      res.status(200).json({
        status: true,
        message: "Success",
        data: dispositionList,
        pagination: pagination(totalCount, perPage, page),
      });
    } catch (error) {
      console.error("Error importing Excel data:", error);
      res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }

  public static async dispositionCreate(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { name, description } = req.body.validatedBodyData;

      const disposition = new Disposition({
        name,
        description,
        statusReference: "RECEIVED",
        status: "ACTIVE",
      });

      await disposition.save();

      res.status(200).json({
        status: true,
        message: "Disposition created successfully",
      });
    } catch (error) {
      console.error("Error creating disposition:", error);
      res.status(500).send({
        status: false,
        message: "Internal server error",
      });
    }
  }
}
