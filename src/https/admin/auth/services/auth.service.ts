import { Admin, adminType } from "../model/admin.model"
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { env } from "../../../../env";
import { Device } from "../model/device.model";
import { devicesEnum } from "../types/auth.type";

export const loginService = async (email: string, password: string) => {
    const findAdmin = await Admin.findOne({ email: email }).populate({
        path: "roleId",
        select: "id displayName name"
    })
    if (!findAdmin) {
        return null
    }
   

    if (findAdmin && findAdmin.password) {
        // const isValid = bcrypt.compareSync(password, findAdmin.password);
        // if (isValid) {

        return findAdmin;
        // }
    }
    return null;
}

export const createToken = async (admin: any) => {
    const token = await jwt.sign({ id: admin._id, role: admin.roleId.name.toString().toUpperCase() ?? "", roleId: admin.roleId }, env.auth.secret as jwt.Secret, {
        expiresIn: env.auth.expiresIn as string | number,
    });
    if (typeof token === "undefined") {
        throw "Could not create token";
    }
    return token
}

export const createDevice = async (id: string, token: string, deviceType: devicesEnum, notificationToken?: string) => {
    return await Device.create({
        userId: id,
        authToken: token,
        device: deviceType,
        notificationToken
    })
}
export const deleteDevice = async (deviceId: string, userId: string) => {

    return await Device.deleteMany(
        {
            _id: deviceId,
            userId: userId,
            deletedAt: null,
        }
    );
}

export const deletedDevicesWithUserId = async (userId: string) => {
    return await Device.deleteMany({ userId: userId })
}