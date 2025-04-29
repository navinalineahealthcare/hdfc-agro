import mongoose from "mongoose";
import modulePermissionData from "../storage/data/module-permission.json";
import { connection } from "../providers/db";
import { Module } from "../https/admin/role-and-permission/models/module";
import { Permission } from "../https/admin/role-and-permission/models/permission";

const seed = async () => {
    try {
        await connection();
        for (const data of modulePermissionData) {
            let module
            const moduleExits = await Module.findOne({ name: data.name })
            if (moduleExits) {
                module = await Module.findByIdAndUpdate(
                    moduleExits.id,
                    {
                        name: data.name,
                        displayName: data.displayName,
                    }
                )

                console.log(`Module updated>>${data.name}`);
            } else {
                module = await Module.create(
                    {
                        name: data.name,
                        displayName: data.displayName,
                    }
                );
                console.log("permissions", data.permissions);
            }
            const permissionsData = data.permissions
            if (module) {
                if (permissionsData) {
                    for (const data of permissionsData) {
                        console.log("dataaaaaaaaaaaa", data);

                        const permissionExits = await Permission.findOne({ displayName: data.displayName })
                        if (permissionExits) {
                            await Permission.findByIdAndUpdate(
                                permissionExits.id,
                                {
                                    name: data.name,
                                    displayName: data.displayName,
                                }
                            )

                            console.log(`Permission updated>>${data.name}`);
                        } else {
                            console.log("createeee", data.displayName);

                            await Permission.create(
                                {
                                    name: data.name,
                                    displayName: data.displayName,
                                    moduleId: module.id,
                                }
                            );
                            console.log(`Permission added>>${data.name}`);
                        }

                    }
                }
            }
        }
        console.log("Role seeding completed");
    } catch (e) {
        console.log("Role seeding failed");
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
};

seed().catch(console.error);