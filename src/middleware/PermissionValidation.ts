import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Role } from "../https/admin/role-and-permission/models/role";

export const verifypermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    0;
    if (!req.body.auth) {
       res.status(401).send({
        status: false,
        message: req.t("user.unauthorized"),
      });
    }
    const roleId = req.body.auth.roleId._id;
    const userId = req.body.auth.user;
    const paths = req.originalUrl.split("/");
    console.log(paths);
    const module = paths[3];
    let permission = paths[4];
    if (permission.includes("?")) {
      const parts = permission.split("?");
      permission = parts[0];
    }
    console.log("module", module);
    console.log("permission", permission);

    let role: any = await Role.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(roleId),
        },
      },
      {
        // Finded module based on the name
        $lookup: {
          from: "modules",
          as: "modules",
          pipeline: [
            {
              $match: {
                name: module,
              },
            },
            {
              // finded permission base on the module and match with permission name
              $lookup: {
                from: "permissions",
                foreignField: "moduleId",
                localField: "_id",
                as: "permission",
                pipeline: [
                  {
                    $match: {
                      name: permission,
                    },
                  },
                  {
                    // Finded role permission based on the permission id and roleId
                    $lookup: {
                      from: "rolehaspermissions",
                      foreignField: "permissionId",
                      localField: "_id",
                      as: "rolehaspermissions",
                      pipeline: [
                        {
                          $match: {
                            roleId: new mongoose.Types.ObjectId(roleId),
                            isGranted: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    // Finded user permission based on the permission id and roleId and userId when granted
                    $lookup: {
                      from: "userhaspermissions",
                      foreignField: "permissionId",
                      localField: "_id",
                      as: "userhaspermissions",
                      pipeline: [
                        {
                          $match: {
                            roleId: new mongoose.Types.ObjectId(roleId),
                            userId: new mongoose.Types.ObjectId(userId),
                            isGranted: true,
                          },
                        },
                      ],
                    },
                  },
                  {
                    // Finded user permission based on the permission id and roleId and userId when is not granted
                    $lookup: {
                      from: "userhaspermissions",
                      foreignField: "permissionId",
                      localField: "_id",
                      as: "userhasNotpermissions",
                      pipeline: [
                        {
                          $match: {
                            roleId: new mongoose.Types.ObjectId(roleId),
                            userId: new mongoose.Types.ObjectId(userId),
                            isGranted: false,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $addFields: {
                      rolehaspermissions: {
                        $arrayElemAt: ["$rolehaspermissions", 0],
                      },
                      userhaspermissions: {
                        $arrayElemAt: ["$userhaspermissions", 0],
                      },
                      userhasNotpermissions: {
                        $arrayElemAt: ["$userhasNotpermissions", 0],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $addFields: {
          modules: { $arrayElemAt: ["$modules", 0] },
          permissionlist: {
            $cond: {
              if: "modules",
              then: { $arrayElemAt: ["$modules.permission", 0] },
              else: { $arrayElemAt: ["$modules.permission", 0] },
            },
          },
        },
      },
      {
        $addFields: {
          permission: { $arrayElemAt: ["$permissionlist", 0] },
        },
      },
    ]);

    if (!role.length) {
       res.status(400).send({
        status: false,
        message: req.t("crud.not_found", { model: "Role" }),
      });
    }

    role = role[0];

    if (!role.modules || (role.module && role.modules == null)) {
       res.status(400).send({
        status: false,
        message: req.t("crud.not_found", { model: "Module" }),
      });
    }

    if (!role.permission || (role.permission && role.permission == null)) {
       res.status(400).send({
        status: false,
        message: req.t("crud.not_found", { model: "Permission" }),
      });
    }

    let permissionData = role.permission;
    let permissionIsFound = false;
    let userAuthorityPermissionIsFound = false;
    if (permissionData.rolehaspermissions) {
      permissionIsFound = true;
    }

    if (!permissionIsFound && permissionData.userhaspermissions) {
      permissionIsFound = true;
      userAuthorityPermissionIsFound = true;
    }

    if (
      permissionIsFound &&
      !userAuthorityPermissionIsFound &&
      permissionData.userhasNotpermissions
    ) {
      permissionIsFound = false;
    }

    if (!permissionIsFound) {
       res.status(405).send({
        status: false,
        message: "Permission not granted for the requested operation.",
      });
    }

    req.body.auth.moduleData = role.modules;

    return next();
  } catch (error: any) {
     res.status(500).json({ error: error.message });
  }
};
