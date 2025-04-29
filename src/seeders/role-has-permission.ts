import mongoose from "mongoose";

import { connection } from "../providers/db";
import { Role } from "../https/admin/role-and-permission/models/role";
import { Permission } from "../https/admin/role-and-permission/models/permission";
import { RoleHasPermission } from "../https/admin/role-and-permission/models/roleHasPermission";

const seed = async () => {
    try {
        await connection();

        const allRoles = await Role.find();
        const allPermissions = await Permission.find();

        for (const roleData of allRoles) {
            console.log(roleData);

            for (const permissionData of allPermissions) {
                console.log(permissionData);

                const permissionExists = await RoleHasPermission.findOne({
                    permissionId: permissionData._id,
                    moduleId: permissionData.moduleId,
                    roleId: roleData.id
                });

                if (permissionExists) {
                    await RoleHasPermission.updateOne(
                        {
                            permissionId: permissionData._id,
                            moduleId: permissionData.moduleId,
                            roleId: roleData.id
                        },
                        {
                            $set: {
                                permissionId: permissionData._id,
                                moduleId: permissionData.moduleId,
                                roleId: roleData.id
                            }
                        }
                    );
                } else {
                    await RoleHasPermission.create({
                        permissionId: permissionData._id,
                        moduleId: permissionData.moduleId,
                        roleId: roleData.id
                    });
                }
            }
        }

        console.log("RoleHasPermission seeding completed");
    } catch (e) {
        console.log("RoleHasPermission seeding failed");
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
};

seed().catch(console.error);