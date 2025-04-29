import { Request, Response } from "express";
import {
  createDevice,
  createToken,
  deleteDevice,
  loginService,
} from "../services/auth.service";
import { loginResponse } from "../responses/login.response";
import { updateProfileResponse } from "../responses/update.profile.response";
import { Admin } from "../model/admin.model";
import { statusEnum } from "../types/auth.type";
import * as jwt from "jsonwebtoken";
import { env } from "../../../../env";
import bcrypt from "bcryptjs";
import {
  verifyFileisAvailable,
  verifyCountry,
  verifyState,
  verifyCity,
  randomNumber,
} from "../../../../utils/utils";
import mongoose, { Types } from "mongoose";
import { Role } from "../../role-and-permission/models/role";
import { RoleHasPermission } from "../../role-and-permission/models/roleHasPermission";
import { UserHasPermission } from "../model/userHasPermission";
import { addLog } from "../../../common/log/services/log.service";
import {
  deleteMediaurl,
  updateMediaurl,
} from "../../../upload/services/media.service";

import { forgotPasswordUrl } from "../../../../jobs/forgotPasswordMailSend";
import fs from "fs";
import path from "path";
import { Device } from "../model/device.model";
import Country from "../../../country-state-city/models/country.model";
import countryTimezone from "countries-and-timezones";
import passport from "passport";
class authController {
  public static async login(req: Request, res: Response) {
    try {
      const { email, password, deviceType, notificationToken } =
        req.body.validatedData;

      const admin: any = await loginService(email, password); // no nee dto define type

      if (!admin) {
        res.status(400).json({
          status: false,
          message: req.t("user.email_not_exists"),
        });
      }
      if (admin && admin.password) {
        const isValid = bcrypt.compareSync(password, admin.password);
        if (!isValid) {
          res.status(400).json({
            status: false,
            message: req.t("user.password_not_match"),
          });
        }
      }

      if (admin && admin.deletedAt != null) {
        res.status(400).json({
          status: false,
          message: req.t("user.user_deleted"),
        });
      }

      if (admin && admin.status == statusEnum.INACTIVE) {
        res.status(400).json({
          status: false,
          message: req.t("user.user_inactive"),
        });
      }

      const token = await createToken(admin);
      const device = await createDevice(
        admin?._id,
        token,
        deviceType,
        notificationToken
      );
      if (!device) {
        res.status(400).json({
          status: false,
          message: req.t("user.wrong_email_or_password"),
        });
      }

      await addLog(
        admin._id,
        "Admin",
        "Auth",
        "Login",
        admin.email + " logged in successfully"
      );
      admin.notificationToken = notificationToken ?? false;
      const countryDetails = await Country.findOne({ _id: admin.countryId });
      if (countryDetails) {
        let getTimeZone = countryTimezone.getCountry(countryDetails?.iso2);
        admin.timezone = getTimeZone ? getTimeZone.timezones[0] : "";
      }

      res.json({
        status: true,
        data: loginResponse(admin),
        accessToken: token,
        message: req.t("user.logged_in"),
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async profileUpdate(req: Request, res: Response) {
    try {
      const {
        firstName,
        lastName,
        password,
        countryId,
        stateId,
        cityId,
        image,
        phoneCode,
        phoneNumber,
        address,
      } = req.body.validatedData;
      const { id } = req.body.validatedParamsData;
      const { userId } = req.body.auth.device;

      // if (countryId) {
      //     await verifyCountry(countryId);
      // }

      // if (stateId) {
      //     await verifyState(stateId);
      // }

      // if (cityId) {
      //     await verifyCity(cityId);
      // }

      if (image && !(await verifyFileisAvailable(image, "ADMIN"))) {
        res.status(400).json({
          status: false,
          message: req.t("upload.image_required", { model: "Admin" }),
        });
      }

      const admin = await Admin.findByIdAndUpdate(
        { _id: userId },
        {
          firstName,
          lastName,
          countryId: countryId && countryId != "" ? countryId : null,
          stateId: stateId && stateId != "" ? stateId : null,
          cityId: cityId && cityId != "" ? cityId : null,
          phoneCode,
          phoneNumber,
          address,
          image,
        }
      );

      if (admin?.image && admin.image != image) {
        await deleteMediaurl(admin.image);
        await updateMediaurl(image, true);
      }

      if (!admin) {
        res.status(400).json({
          status: false,
          message: req.t("crud.not_found", { model: "Profile" }),
        });
      }
      if (password) {
        const hashedPassword = await bcrypt.hashSync(password);
        await Admin.findByIdAndUpdate(
          { _id: userId },
          {
            password: hashedPassword,
          }
        );
      }
      if (admin && admin.deletedAt != null) {
        res.status(400).json({
          status: false,
          message: req.t("user.user_deleted"),
        });
      }
      let adminDetails: any = await Admin.aggregate([
        {
          $match: {
            _id: userId,
          },
        },
        {
          $lookup: {
            from: "countries",
            foreignField: "_id",
            localField: "countryId",
            as: "countryId",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "states",
            foreignField: "_id",
            localField: "stateId",
            as: "stateId",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "cities",
            foreignField: "_id",
            localField: "cityId",
            as: "cityId",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                  iso2: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "roles",
            foreignField: "_id",
            localField: "roleId",
            as: "roleId",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                  displayName: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            countryId: { $arrayElemAt: ["$countryId", 0] },
            stateId: { $arrayElemAt: ["$stateId", 0] },
            cityId: { $arrayElemAt: ["$cityId", 0] },
            roleId: { $arrayElemAt: ["$roleId", 0] },
          },
        },
      ]);

      adminDetails = adminDetails[0];

      res.json({
        status: true,
        data: updateProfileResponse(adminDetails),
        message: req.t("crud.updated", { model: "Profile" }),
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.body.auth.device;

      let getUserProfile: any = await Admin.aggregate([
        {
          $match: {
            _id: userId,
          },
        },
        {
          $lookup: {
            from: "countries",
            foreignField: "_id",
            localField: "countryId",
            as: "countryId",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "states",
            foreignField: "_id",
            localField: "stateId",
            as: "stateId",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "cities",
            foreignField: "_id",
            localField: "cityId",
            as: "cityId",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                  iso2: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "roles",
            foreignField: "_id",
            localField: "roleId",
            as: "roleId",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  name: 1,
                  displayName: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            countryId: { $arrayElemAt: ["$countryId", 0] },
            stateId: { $arrayElemAt: ["$stateId", 0] },
            cityId: { $arrayElemAt: ["$cityId", 0] },
            roleId: { $arrayElemAt: ["$roleId", 0] },
          },
        },
      ]);

      if (!getUserProfile.length) {
        res.status(400).json({
          status: false,
          message: req.t("crud.not_found", { model: "Profile" }),
        });
      }
      getUserProfile = getUserProfile[0];

      res.status(200).json({
        status: true,
        data: updateProfileResponse(getUserProfile),
        message: req.t("crud.list", { model: "Profile" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async forgot(req: Request, res: Response) {
    try {
      const { email } = req.body.validatedData;

      const admin = await Admin.findOne({ email: email });
      if (!admin) {
        res.status(400).json({
          status: false,
          message: "Admin not found with this email.",
        });
      }

      const token = jwt.sign({ adminId: admin?._id }, env.auth.secret, {
        expiresIn: env.auth.forgotPasswordExpiredIn,
      });

      await Admin.findByIdAndUpdate(
        { _id: admin?.id },
        { $set: { forgotPasswordToken: token } }
      );

      //mail sent process
      const url = `http://localhost:4000/reset_password?token=${token}`; //change
      const subject = "Reset your password";
      const templateData = { link: url };
      const pathValue = env.app.host === "local" ? "src" : "dist";

      // const emailTemplate = fs.readFileSync(path.join(__dirname, pathValue, "../../../../../views/email/forgotPassword.hbs"), "utf-8")

      const emailTemplate = fs.readFileSync(
        path.join(__dirname, "views/email/forgotPassword.hbs"),
        "utf-8"
      );
      const data = {
        email,
        data: templateData,
        subject,
        emailTemplate,
      };

      // await sendForgotPasswordEmail(data);
      res.json({
        status: true,
        message: req.t("user.forgot_password_reset_link"),
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async checkResetToken(req: Request, res: Response) {
    res.send({
      status: true,
    });
  }

  public static async resetPassword(req: Request, res: Response) {
    const { password } = req.body.validatedData;
    const { admin } = req.body.auth;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      { _id: admin.id },
      {
        $set: {
          forgotPasswordToken: null,
          password: await bcrypt.hashSync(password),
        },
      }
    );

    if (!updatedAdmin) {
      res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Admin" }),
      });
    }

    //TODO delete all the previous devices and lot out all devices

    res.send({
      status: true,
      message: req.t("user.password_reset_success"),
    });
  }

  public static async googleAuth(req: Request, res: Response) {
    try {
      passport.authenticate("google", {
        scope: ["profile", "email"],
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async googleCallback(req: Request, res: Response) {
    try {
      passport.authenticate("google", {
        successRedirect: `${process.env.CLIENT_URL + "/dashboard"}`,
        failureRedirect: `${process.env.CLIENT_URL + "/login"}`,
      });
    } catch (error: any) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  public static async resetPasswordAdmin(req: Request, res: Response) {
    const { password, current_password, confirm_password } =
      req.body.validatedData;
    const { user } = req.body.auth;
    if (confirm_password != password) {
      res.json({
        status: false,
        message: req.t("user.confirm_password_passoword_same"),
      });
    }
    const userData: any = await Admin.findById({
      _id: new Types.ObjectId(user),
    });

    const isValid = bcrypt.compareSync(current_password, userData?.password);

    if (current_password === password) {
      res.json({
        status: false,
        message: req.t("user.same_password"),
      });
    }
    if (isValid) {
      await Admin.findByIdAndUpdate(
        {
          _id: new Types.ObjectId(user),
        },
        {
          forgotPasswordToken: null,
          password: await bcrypt.hashSync(password),
        },
        { new: true }
      );
    } else {
      res.json({
        status: false,
        message: req.t("user.user_wrong_password"),
      });
    }

    res.send({
      status: true,
      message: req.t("user.password_reset_successs"),
    });
  }

  public static async logout(req: Request, res: Response) {
    const { device, userId } = req.body.auth;
    await deleteDevice(device.id, device.userId);

    res.json({
      status: true,
      message: req.t("user.logged_out"),
    });
  }

  public static async permissionList(req: Request, res: Response) {
    try {
      const id = req.body.auth.user;

      let admin: any = await Admin.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "roles",
            foreignField: "_id",
            localField: "roleId",
            as: "roles",
          },
        },
        {
          $lookup: {
            from: "rolehaspermissions",
            foreignField: "roleId",
            localField: "roleId",
            as: "rolehasPermissions",
            pipeline: [
              {
                $lookup: {
                  from: "roles",
                  localField: "roleId",
                  foreignField: "_id",
                  as: "role",
                },
              },
              {
                $unwind: {
                  path: "$role",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "modules",
                  localField: "moduleId",
                  foreignField: "_id",
                  as: "module",
                },
              },
              {
                $unwind: {
                  path: "$module",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "permissions",
                  localField: "permissionId",
                  foreignField: "_id",
                  as: "module.permissions",
                },
              },
              {
                $unwind: {
                  path: "$module.permissions",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $addFields: {
                  "module.permissions.isGranted": "$isGranted",
                },
              },
              {
                $group: {
                  _id: "$module._id",
                  module: {
                    $first: "$module",
                  },
                  role: {
                    $first: "$role",
                  },
                  permissions: {
                    $push: "$module.permissions",
                  },
                  createdAt: {
                    $first: "$createdAt",
                  },
                  updatedAt: {
                    $first: "$updatedAt",
                  },
                },
              },
              {
                $addFields: {
                  "module.permissions": {
                    $filter: {
                      input: "$permissions",
                      as: "score",
                      cond: { $eq: ["$$score.isGranted", true] },
                    },
                  },
                },
              },
              {
                $unset: ["permissions"],
              },
            ],
          },
        },
        {
          $lookup: {
            from: "userhaspermissions",
            foreignField: "userId",
            localField: "_id",
            as: "userhaspermissions",
          },
        },
        {
          $addFields: {
            roles: { $arrayElemAt: ["$roles", 0] },
          },
        },
      ]);

      if (!admin.length) {
        res.status(404).json({
          status: false,
          message: req.t("crud.not_found", { model: "Admin" }),
        });
      }

      admin = admin[0];

      if (!admin.roles) {
        res.status(404).json({
          status: false,
          message: req.t("crud.not_found", { model: "Role" }),
        });
      }

      const RoleDetails = admin.roles;

      let roleHasPermissionsArray = [...admin.rolehasPermissions];

      let userHasPermissions = admin.userhaspermissions;

      // const admin = await Admin.findOne({ _id: id });

      // if (!admin) {
      //    res.status(404).json({ error: 'Admin not found' });
      // }

      // const RoleDetails = await Role.findOne({ _id: admin.roleId });

      // if (!Role) {
      //    res.status(404).json({ error: 'Role not found' });
      // }

      // const roleHasPermissions = await RoleHasPermission.aggregate(

      //     [
      //         {
      //             '$match': {
      //                 'roleId': new Types.ObjectId(RoleDetails?._id)
      //             }
      //         }, {
      //             '$lookup': {
      //                 'from': 'roles',
      //                 'localField': 'roleId',
      //                 'foreignField': '_id',
      //                 'as': 'role'
      //             }
      //         }, {
      //             '$unwind': {
      //                 'path': '$role',
      //                 'preserveNullAndEmptyArrays': true
      //             }
      //         }, {
      //             '$lookup': {
      //                 'from': 'modules',
      //                 'localField': 'moduleId',
      //                 'foreignField': '_id',
      //                 'as': 'module'
      //             }
      //         }, {
      //             '$unwind': {
      //                 'path': '$module',
      //                 'preserveNullAndEmptyArrays': true
      //             }
      //         }, {
      //             '$lookup': {
      //                 'from': 'permissions',
      //                 'localField': 'permissionId',
      //                 'foreignField': '_id',
      //                 'as': 'module.permissions'
      //             }
      //         }, {
      //             '$unwind': {
      //                 'path': '$module.permissions',
      //                 'preserveNullAndEmptyArrays': true
      //             }
      //         }, {
      //             '$addFields': {
      //                 'module.permissions.isGranted': '$isGranted'
      //             }
      //         }, {
      //             '$group': {
      //                 '_id': '$module._id',
      //                 'module': {
      //                     '$first': '$module'
      //                 },
      //                 'role': {
      //                     '$first': '$role'
      //                 },
      //                 'permissions': {
      //                     '$push': '$module.permissions'
      //                 },
      //                 'createdAt': {
      //                     '$first': '$createdAt'
      //                 },
      //                 'updatedAt': {
      //                     '$first': '$updatedAt'
      //                 }
      //             }
      //         },
      //         {
      //             '$addFields': {
      //                 // 'module.permissions': '$permissions'
      //                 'module.permissions': {
      //                     '$filter': {
      //                         'input': "$permissions",
      //                         'as': "score",
      //                         'cond': { '$eq': ["$$score.isGranted", true] }
      //                     }
      //                 }
      //             }
      //         }, {
      //             '$unset': [
      //                 'permissions'
      //             ]
      //         }
      //     ]
      // );

      // let roleHasPermissionsArray = [...roleHasPermissions]

      // const userHasPermissions = await UserHasPermission.find({
      //     userId: id
      // })

      userHasPermissions.forEach((userHasPermissionItem: any) => {
        const roleIndex = roleHasPermissionsArray.findIndex((item) => {
          return (
            item.module._id.toString() ===
            userHasPermissionItem.moduleId.toString()
          );
        });

        if (roleIndex > -1) {
          const permissionArray =
            roleHasPermissionsArray[roleIndex].module.permissions;
          permissionArray.forEach((permissionItem: any, index: number) => {
            if (
              permissionItem._id.toString() ===
              userHasPermissionItem.permissionId.toString()
            ) {
              roleHasPermissionsArray[roleIndex].module.permissions[
                index
              ].isGranted = userHasPermissionItem.isGranted;
            }
          });
        }
      });
      // let filteredRoleHasPermissionsArray
      if (roleHasPermissionsArray) {
        const filteredRoleHasPermissionsArray = roleHasPermissionsArray.filter(
          (item) => {
            const permissions = item.module.permissions;
            const isGrantedPermissions = permissions.filter(
              (permission: any) => permission.isGranted
            );
            return isGrantedPermissions.length > 0;
          }
        );

        if (filteredRoleHasPermissionsArray.length > 0) {
          res.status(200).json({
            status: true,
            data: filteredRoleHasPermissionsArray,
            message: req.t("crud.list", { model: "Permissions" }),
          });
        } else {
          res.status(401).json({
            status: false,
            message: req.t(
              "You Don't have permission please contact to alineahealth super admin."
            ),
          });
        }
      } else {
        res.status(401).json({
          status: false,
          message: req.t(
            "You Don't have permission please contact to alineahealth super admin."
          ),
        });
      }
      // if (roleHasPermissionsArray) {
      //    res.status(200).json({
      //         status: true,
      //         data: roleHasPermissionsArray,
      //         message: req.t("crud.list", { model: "Permissions" })
      //     })
      // }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async RoleList(req: Request, res: Response) {
    try {
      const AllRole = await Role.find({});
      res.status(200).json({
        status: true,
        data: AllRole,
        message: req.t("crud.list", { model: "Role" }),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async setNotificationToken(req: Request, res: Response) {
    try {
      const { _id } = req.body.auth.device;
      const { notificationToken } = req.body.validatedData;

      await Device.updateOne({ _id: _id }, { $set: { notificationToken } });

      res.status(200).json({
        status: true,
        message: req.t("crud.updated", { model: "Notification token" }),
      });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default authController;
