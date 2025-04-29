import { Router } from "express";
import { CountryProvinceCityRequest } from "../requests/country-state-city.request";
import { RequestParamsValidator, RequestQueryValidator } from "../../../middleware/RequestValidator";
import { CountyStateCityController } from "../controller/country-state-city.controller";
import { IdQueryParamRequest } from "../../admin/auth/requests/id.params.request";



const router = Router();

router.get(
  "/countries",
  RequestQueryValidator(CountryProvinceCityRequest),
  CountyStateCityController.countries
);

router.get(
  "/states/:id",
  RequestParamsValidator(IdQueryParamRequest),
  RequestQueryValidator(CountryProvinceCityRequest),

  CountyStateCityController.provinces
);

router.get(
  "/cities/:id",
  RequestQueryValidator(CountryProvinceCityRequest),
  RequestParamsValidator(IdQueryParamRequest),
  CountyStateCityController.cities
);

export default router;
