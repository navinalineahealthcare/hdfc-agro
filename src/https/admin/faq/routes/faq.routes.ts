import { Router } from "express";
import {
  RequestParamsValidator,
  RequestQueryValidator,
  RequestValidator,
  RequestSortValidator,
} from "../../../../middleware/RequestValidator";
import { FaqController } from "../controllers/faq.controller";
import { faqRequest } from "../requests/faq.requests";
import { IdQueryParamRequestFaq } from "../requests/id.params.request";
import { StatusUpdateRequest } from "../requests/status.update.request";
import { FaqFilterRequest } from "../requests/filter.request";
import { paginationCleaner } from "../../../../middleware/Pagination";

const router = Router();

router.post(
  "/add",
  RequestValidator(faqRequest),
  FaqController.add);


router.get(
  "/list",
  RequestSortValidator(["status", "question", "answer", "type", "createdAt"]),
  paginationCleaner,
  RequestQueryValidator(FaqFilterRequest),
  FaqController.list
);

router.put(
  "/update/:id",
  RequestParamsValidator(IdQueryParamRequestFaq),
  RequestValidator(faqRequest),
  FaqController.update
);

router.delete(
  "/delete/:id",
  RequestParamsValidator(IdQueryParamRequestFaq),
  FaqController.delete
);

router.put(
  "/status/:id",
  RequestParamsValidator(IdQueryParamRequestFaq),
  RequestValidator(StatusUpdateRequest),
  FaqController.statusChange
);

export default router;
