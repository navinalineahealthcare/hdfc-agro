import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  createDefultRolePermission,
  pagination,
} from "../../../../utils/utils";
import { addLog } from "../../../common/log/services/log.service";
import { UserHasPermission } from "../../auth/model/userHasPermission";
import { Role } from "../models/role";
import { RoleHasPermission } from "../models/roleHasPermission";

export class RoleHasPermissionController {
  public static async RolePermissionList(req: Request, res: Response) {
    try {
      const { id } = req.body.validatedParamsData;
      const rolePermissions = await RoleHasPermission.aggregate([
        {
          $match: {
            roleId: new Types.ObjectId(id),
          },
        },
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
            "module.permissions": "$permissions",
          },
        },
        {
          $unset: ["permissions"],
        },
      ]);
      if (rolePermissions.length === 0) {
        res.status(404).json({ error: "Role permissions not found" });
      }
      // Sort the rolePermissions array by module name in ascending order
      rolePermissions.sort((a: any, b: any) => {
        const moduleNameA = a.module.name.toUpperCase();
        const moduleNameB = b.module.name.toUpperCase();

        return moduleNameA.localeCompare(moduleNameB);
      });

      res.status(200).json({
        status: true,
        data: rolePermissions,
        message: req.t("crud.list", { model: "Role permissions" }),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async PermissionUpdate(req: Request, res: Response) {
    const { roleId, moduleWithPermission } = req.body.validatedData;
    try {
      const existingRole = await RoleHasPermission.findOne({ roleId: roleId });

      if (!existingRole) {
        res.status(404).json({ error: "Role not found" });
      }
      let update;
      for (const moduleData of moduleWithPermission) {
        const moduleId = new Types.ObjectId(moduleData.moduleId);

        for (const permission of moduleData.permissions) {
          const permissionId = new Types.ObjectId(permission._id);

          // Check if both moduleId and permissionId exist
          const existingPermission = await RoleHasPermission.findOne({
            roleId: roleId,
            moduleId: moduleId,
            permissionId: permissionId,
          });

          const updateOneOperation = {
            filter: {
              roleId: roleId,
              moduleId: moduleId,
              permissionId: permissionId,
            },
            update: {
              $set: {
                isGranted:
                  permission.isGranted !== undefined
                    ? permission.isGranted
                    : false,
              },
            },
            new: true,
          };

          if (!existingPermission) {
            res.status(400).json({ error: "Permission not found" });
          }

          update = await RoleHasPermission.updateOne(
            updateOneOperation.filter,
            updateOneOperation.update,
            { new: true }
          );
        }
      }
      if (update) {
        if (update) {
          res.status(200).json({
            status: true,
            data: update,
            message: req.t("crud.updated", { model: "Role permissions" }),
          });
        }
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async RoleCreate(req: Request, res: Response) {
    try {
      const { displayName, description } = req.body.validatedData;
      const { userId } = req.body.auth.device;
      const name = displayName.toLowerCase().replace(/\s/g, "_");
      const roleExits = await Role.findOne({
        name: name,
        displayName: displayName,
      });

      if (roleExits) {
        res.status(400).json({ message: "Role already exits" });
      }

      const role = await Role.create({
        name: name,
        displayName: displayName,
        description: description,
      });

      if (role) {
        await createDefultRolePermission(role._id as string);
        await addLog(
          userId,
          "Admin",
          "Role-permissions",
          "Role Added",
          "Role has been added successfully"
        );
        res.status(200).json({
          status: true,
          data: role,
          message: req.t("crud.created", { model: "Role" }),
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async RoleList(req: Request, res: Response) {
    try {
      const AllRole = await Role.find({
        deletedAt: null,
      }).sort({ createdAt: -1 });

      res.status(200).json({
        status: true,
        data: AllRole,
        message: req.t("crud.list", { model: "Role" }),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async SpecificUserList(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, roleId, search, fromDate, toDate } =
        req.body.validatedQueryData;
      const { page, perPage } = req.body.pagination;
      const { sortBy, sortType } = req.body.validatedSortData;
      const id = req.body.auth.user;

      let filterQuery: any = {
        deletedAt: null,
        _id: { $ne: id },
      };

      let sort: any = {
        createdAt: -1,
      };

      if (sortBy !== undefined) {
        sort = {
          [sortBy]: sortType == "asc" ? 1 : -1,
        };
      }

      if (firstName)
        filterQuery.users.firstName = {
          $regex: new RegExp(firstName),
          $options: "i",
        };

      if (lastName)
        filterQuery.users.lastName = {
          $regex: new RegExp(lastName),
          $options: "i",
        };

      if (email) filterQuery.users.email = email;

      if (roleId) filterQuery.roleId = new Types.ObjectId(roleId);

      if (
        search &&
        search !== undefined &&
        typeof search === "string" &&
        search.length !== 0
      ) {
        filterQuery.$or = [
          { "users.firstName": { $regex: new RegExp(search), $options: "i" } },
          { "users.lastName": { $regex: new RegExp(search), $options: "i" } },
          { "users.email": { $regex: new RegExp(search), $options: "i" } },
        ];
      }

      if (fromDate && toDate && fromDate != undefined && toDate != undefined) {
        filterQuery.users.createdAt = {
          $gte: fromDate,
          $lte: new Date(
            new Date(toDate).setUTCHours(23, 59, 59)
          ).toISOString(),
        };
      }

      const userlist = await UserHasPermission.aggregate([
        {
          $group: {
            _id: "$userId",
            data: {
              $first: "$$ROOT",
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: "$data",
          },
        },
        {
          $lookup: {
            from: "admins",
            localField: "userId",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $unwind: {
            path: "$users",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "countries",
            localField: "users.countryId",
            foreignField: "_id",
            as: "users.countryId",
          },
        },
        {
          $unwind: {
            path: "$users.countryId",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "states",
            localField: "users.stateId",
            foreignField: "_id",
            as: "users.stateId",
          },
        },
        {
          $unwind: {
            path: "$users.stateId",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "cities",
            localField: "users.cityId",
            foreignField: "_id",
            as: "users.cityId",
          },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: "$users.cityId",
              preserveNullAndEmptyArrays: true,
            },
        },
        {
          $match: filterQuery,
        },
        {
          $project: {
            _id: "$userId",
            firstName: "$users.firstName",
            lastName: "$users.lastName",
            email: "$users.email",
            roleId: "$users.roleId",
            status: "$users.status",
            country: "$users.countryId",
            state: "$users.stateId",
            city: "$users.cityId",
            createdAt: "$users.createdAt",
            updatedAt: "$users.updatedAt",
            phoneCode: "$users.phoneCode",
            phoneNumber: "$users.phoneNumber",
            address: "$users.address",
            image: "$users.image",
          },
        },
      ])
        .skip(perPage * (page - 1))
        .limit(perPage)
        .sort(sort);

      const totalCount = userlist.length;
      res.status(200).json({
        status: true,
        data: userlist,
        pagination: pagination(totalCount, perPage, page),
        message: req.t("crud.list", { model: "Specific User" }),
      });
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }
}
