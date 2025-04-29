import { Request, Response } from "express";
import Country from "../models/country.model";
import State from "../models/state.model";
import City from "../models/city.model";
import mongoose from "mongoose";

export class CountyStateCityController {

  public static async countries(req: Request, res: Response): Promise<void> {
    let { name, ios2 } = req.body.validatedQueryData;
    let querySearch = {};

    if (name && typeof name === "string" && name.length !== 0) {
      querySearch = { ...querySearch, name: { $regex: new RegExp(name, "i") } };
    }

    if (ios2 && typeof ios2 === "string" && ios2.length !== 0) {
      querySearch = { ...querySearch, iso2: { $regex: new RegExp(ios2, "i") } };
    }

    const countries = await Country.find(querySearch);

    res.send({
      status: true,
      data: countries,
      message: "countries details",
    });
  }

  public static async provinces(req: Request, res: Response): Promise<void> {
    let { name } = req.body.validatedQueryData;
    const { id } = req.body.validatedParamsData;

    let querySearch: any = { countryId: id };

    if (name && typeof name === "string" && name.length !== 0) {
      querySearch = { ...querySearch, name: { $regex: new RegExp(name, "i") } };
    }

    const states = await State.find(querySearch, {
      _id: 1,
      name: 1,
      countryId: 1,
    });

    res.send({
      status: true,
      data: states,
      message: "states details",
    });
  }

  public static async cities(req: Request, res: Response): Promise<void> {
    let { name } = req.body.validatedQueryData;
    const { id } = req.body.validatedParamsData;
    let querySearch: any = { stateId: new mongoose.Types.ObjectId(id) };

    if (name && typeof name === "string" && name.length !== 0) {
      querySearch = { ...querySearch, name: { $regex: new RegExp(name, "i") } };
    }

    const cities = await City.find(querySearch, { _id: 1, name: 1 });

    res.send({
      status: true,
      data: cities,
      message: "cities details",
    });
  }
}
