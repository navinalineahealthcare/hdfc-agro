import bcrypt from "bcryptjs";
import { adminType, IAdminType } from "../https/admin/auth/types/auth.type";
import mongoose from "mongoose";
import { Admin } from "../https/admin/auth/model/admin.model";
import { connection } from "../providers/db";
import { Role } from "../https/admin/role-and-permission/models/role";
import { rolesEnum, statusEnum } from "../https/common/enums";

const seed = async () => {
  try {
    await connection();

    const adminData: IAdminType[] = [
      {
        firstName: "Developer",
        lastName: "alineahealthcare",
        email: "developer.alineahealthcare@yopmail.com",
        password: await bcrypt.hash("123456", 10),
        role: rolesEnum.SUPER_ADMIN,
        contactCode: "developer.alineahealthcare",
        phoneCode: "+91",
        phoneNumber: "1234567890",
        status: statusEnum.ACTIVE,
        roleId: undefined,
        image: "",
        address: "",
        notificationToken: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: undefined,
        updatedBy: undefined,
        deletedAt: null,
        forgotPasswordToken: "",
      },
      {
        firstName: "Navin",
        lastName: "kumar",
        contactCode: "navin.kumar",
        email: "navin.Kumar@alineahealthcare.in",
        password: await bcrypt.hash("123456", 10),
        role: "Super_Admin",
        forgotPasswordToken: "",
        status: "",
        phoneCode: "",
        phoneNumber: ""
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
