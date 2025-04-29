import bcrypt from "bcryptjs";
import { adminType, rolesEnum } from "../https/admin/auth/types/auth.type";
import mongoose from "mongoose";
import { Admin } from "../https/admin/auth/model/admin.model";
import { connection } from "../providers/db";
import { Role } from "../https/admin/role-and-permission/models/role";

const seed = async () => {
  try {
    await connection();

    interface adminInputType {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: string;
    }
    const adminData: adminInputType[] = [
      {
        firstName: "Developer",
        lastName: "alineahealthcare",
        email: "developer.alineahealthcare@yopmail.com",
        password: await bcrypt.hash("Admin@1234", 10),
        role: "Super_Admin",
      },
      {
        firstName: "Navin",
        lastName: "kumar",
        email: "navin.Kumar@alineahealthcare.in",
        password: await bcrypt.hash("Admin@1234", 10),
        role: "Super_Admin",
      },
    
    ];

    for (const data of adminData) {
      await Admin.findOneAndUpdate(
        { email: data.email },
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        },
        {
          new: true,
          upsert: true,
        }
      );

      const roleExits = await Role.findOne({ name: data.role });
      if (roleExits) {
        await Admin.findOneAndUpdate(
          { email: data.email },
          {
            roleId: roleExits._id,
          }
        );
      }
      console.log(`admin seed this email>>${data.email}`);
    }

    console.log("admin seeding completed");
  } catch (e) {
    console.log("admin seeding failed");
    console.error(e);
  } finally {
    await mongoose.connection.close();
  }
};

seed().catch(console.error);
