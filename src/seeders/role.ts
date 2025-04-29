import mongoose from "mongoose";
import roleData from "../storage/data/role.json";
import { connection } from "../providers/db";
import { Role } from "../https/admin/role-and-permission/models/role";

const seed = async () => {
    try {
        await connection();
        for (const data of roleData) {
            const roleExits = await Role.findOne({ name: data.name })
            if (roleExits) {
                await Role.findByIdAndUpdate(
                    roleExits.id,
                    {
                        name: data.name,
                        displayName: data.displayName,
                        description: data.description
                    })
                console.log(`Role updated>>${data.name}`);
            } else {
                await Role.create(
                    {
                        name: data.name,
                        displayName: data.displayName,
                        description: data.description
                    }
                );
                console.log(`Role added>>${data.name}`);
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