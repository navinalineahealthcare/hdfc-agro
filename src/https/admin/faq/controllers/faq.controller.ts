import { Request, Response } from "express";
import { Faq } from "../models/faq.model";
import { faqResponse } from "../responses/faq.response";
import { pagination } from "../../../../utils/utils";
import { addLog } from "../../../common/log/services/log.service";

export class FaqController {
  public static async add(req: Request, res: Response) {
    try {
      const { question, answer, type } = req.body.validatedData;
      const { userId } = req.body.auth.device;

      const faq = await Faq.create({
        question,
        answer,
        type,
      });

      await addLog(userId, "Admin", "FAQ", "FAQ Added", "FAQ has been added successfully");

       res.json({
        status: true,
        data: faqResponse(faq),
        message: req.t("crud.created", { model: "Faq" }),
      });
    } catch (error: any) {
       res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const { question, answer, type } = req.body.validatedData;
      const { id } = req.body.validatedParamsData;
      const { userId } = req.body.auth.device;
      const faq = await Faq.findByIdAndUpdate(
        { _id: id },
        {
          question,
          answer,
          type,
        },
        { new: true }
      );
      if (!faq) {
         res.status(400).json({
          status: false,
          message: req.t("crud.not_found", { model: "Faq" }),
        });
      }

      await addLog(userId, "Admin", "FAQ", "FAQ Update", faq.question + " has been updated successfully");

       res.json({
        status: true,
        data: faqResponse(faq),
        message: req.t("crud.updated", { model: "Faq" }),
      });
    } catch (error: any) {
       res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const { id } = req.body.validatedParamsData;
      const { userId } = req.body.auth.device;

      const faqByType:any = await Faq.findOne({_id: id});

      if(!faqByType){
         res.status(400).json({
          status: false,
          message: req.t("crud.not_found", { model: "Faq" }),
        });
      }

      const findFaqCount:number = await Faq.countDocuments({ type:faqByType.type, deletedAt: null });

      if(findFaqCount <= 2){
         res.status(400).json({
          status: false,
          message: req.t("crud.items_not_deleted", { count: 2, model: "FAQ"})
        })
      }

      const faq = await Faq.findByIdAndUpdate(
        { _id: id },
        { $set: { deletedAt: new Date() } },
        { new: true }
      );
      if (!faq) {
         res.status(400).json({
          status: false,
          message: req.t("crud.not_found", { model: "Faq" }),
        });
      }

      await addLog(userId, "Admin", "FAQ", "FAQ Deleted", faq.question + " has been deleted successfully");

       res.json({
        status: true,
        data: faqResponse(faq),
        message: req.t("crud.deleted", { model: "Faq" }),
      });
    } catch (error: any) {
       res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async list(req: Request, res: Response) {
    try {
      const { status, question, answer, type, search, fromDate, toDate } = req.body.validatedQueryData;

      let query: any = {
        deletedAt: null,
      };

      const { page, perPage } = req.body.pagination;
      const { sortBy, sortType } = req.body.validatedSortData;

      let sort: any = {
        createdAt: -1
      };

      if (sortBy !== undefined) {
        sort = {
          [sortBy]: sortType == 'asc' ? 1 : -1,
        };
      }

      if (status) query.status = status;

      if (question)
        query.question = { $regex: new RegExp(question), $options: "i" };

      if (answer) query.answer = { $regex: new RegExp(answer), $options: "i" };

      if (type) query.type = type;

      if (
        search &&
        search !== undefined &&
        typeof search === "string" &&
        search.length !== 0
      ) {
        query.$or = [
          { status: { $regex: new RegExp(search), $options: "i" }},
          { question: { $regex: new RegExp(search), $options: "i" }},
          { answer: { $regex: new RegExp(search), $options: "i" }},
          { type: { $regex: new RegExp(search), $options: "i" }},
        ]
      }

      if(fromDate && toDate && fromDate != undefined && toDate != undefined){
        query.createdAt = {
          $gte: fromDate,
          $lte: new Date(new Date(toDate).setUTCHours(23,59,59)).toISOString(),
        }
      }

      const faq = await Faq.find(query)
        .skip(perPage * (page - 1))
        .limit(perPage)
        .sort(sort);

      if (!faq) {
         res.status(400).json({
          status: false,
          message: req.t("crud.not_found", { model: "Faq" }),
        });
      }

      const totalCount = await Faq.find(query).countDocuments();

       res.json({
        status: true,
        data: faqResponse(faq),
        pagination: pagination(totalCount, perPage, page),
        message: req.t("crud.list", { model: "Faq" }),
      });
    } catch (error: any) {
       res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }


  public static async statusChange(req: Request, res: Response) {
    try {
      const { status } = req.body.validatedData;
      const { id } = req.body.validatedParamsData;
      const { userId } = req.body.auth.device;

      const faq = await Faq.findByIdAndUpdate(
        { _id: id },
        { $set: { status: status } },
        { new: true }
      );
      if (!faq) {
         res.status(400).json({
          status: false,
          message: req.t("crud.not_found", { model: "Faq" }),
        });
      }

      await addLog(userId, "Admin", "FAQ", "FAQ Status change", "Activity status has been changed with " + status + " of " + faq.question);

       res.json({
        status: true,
        data: faqResponse(faq),
        message: req.t("crud.updated", { model: "Faq" }),
      });
    } catch (error: any) {
       res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
}
