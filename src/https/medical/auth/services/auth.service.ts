import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { env } from "../../../../env";

import { devicesEnum } from "../../../common/enums";
import e from "express";
import { Admin } from "../../../admin/auth/model/admin.model";
import { Device } from "../../../admin/auth/model/device.model";

export const createToken = async (admin: any) => {
  try {
    if (!admin) {
      throw "Admin not found";
    }
    console.log(
      {
        id: admin._id,
        role: admin.roleId.name.toString().toUpperCase() ?? "",
        roleId: admin.roleId,
      },
      env.auth.secret as jwt.Secret,
      {
        expiresIn: env.auth.expiresIn,
      },
      "------------------>"
    );

    // @ts-ignore
    const token = await jwt.sign(
      {
        id: admin._id,
        role: admin.roleId.name.toString().toUpperCase() ?? "",
        roleId: admin.roleId,
      },
      env.auth.secret as jwt.Secret,
      {
        expiresIn: env.auth.expiresIn.toString() + "h",
      }
    );

    if (typeof token === "undefined") {
      throw "Could not create token";
    }

    return token;
  } catch (error) {
    console.log(error, "error=========");
    throw error;
  }
};
export const createCaseToken = async (cases: any) => {
  try {
    if (!cases) {
      throw "cases not found";
    }
    console.log(
      {
        cases: cases,
        env: env.auth.secret as jwt.Secret,
        expiresIn: env.auth.expiresIn,
      },
      "------------------>"
    );

    // @ts-ignore
    const token = await jwt.sign(
      {
        id: cases._id,
        openCaseId: cases.openCaseId,
        insuredName: cases.insuredName.toString().toUpperCase() ?? "",
      },
      env.auth.secret as jwt.Secret,
      {
        expiresIn: env.auth.expiresIn.toString() + "h",
      }
    );

    if (typeof token === "undefined") {
      throw "Could not create token";
    }

    return token;
  } catch (error) {
    console.log(error, "error=========");
    throw error;
  }
};

export const createDevice = async (
  id: string,
  token: string,
  deviceType: devicesEnum,
  notificationToken?: string
) => {
  return await Device.create({
    userId: id,
    authToken: token,
    device: deviceType,
    notificationToken,
  });
};
export const deleteDevice = async (deviceId: string, userId: string) => {
  return await Device.deleteMany({
    _id: deviceId,
    userId: userId,
    deletedAt: null,
  });
};

export const deletedDevicesWithUserId = async (userId: string) => {
  return await Device.deleteMany({ userId: userId });
};
