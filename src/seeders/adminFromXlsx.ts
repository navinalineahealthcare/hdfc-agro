import mongoose from "mongoose";
import xlsx from "xlsx";
import path from "path";
import bcrypt from "bcryptjs";
import { Admin } from "../https/admin/auth/model/admin.model";
import { Doctor } from "../https/admin/doctor/models/doctor.model";
import { statusEnum } from "../https/common/enums";
import { connection } from "../providers/db";

const filePath = path.resolve(
  __dirname,
  "../storage/assets/DoctorsLoginDetails.xlsx"
);
const workbook = xlsx.readFile(filePath);

const adminJson = xlsx.utils.sheet_to_json(workbook.Sheets["AdminData"]);
const doctorJson = xlsx.utils.sheet_to_json(workbook.Sheets["DoctorData"]);
const addressJson = xlsx.utils.sheet_to_json(workbook.Sheets["Address"]);

const seed = async () => {
  try {
    await connection();
    const adminIdMap = new Map<string, mongoose.Types.ObjectId>();

    // Prepare address map
    const addressMap = new Map<string, any>();

    console.log(addressJson, "------");

    for (const addr of addressJson as any[]) {
      addressMap.set(String(addr.AddressID), addr);
    }

    // Seed Admins with upsert
    for (const row of adminJson as any[]) {
      const contactCode = row.ContactPersonCode;

      const baseAdminData = {
        firstName: row.ContactPersonFname || null,
        lastName: row.ContactPersonLName || null,
        contactCode,
        email: null,
        password: bcrypt.hashSync(String(row.UserPassword || "123456"), 10),
        forgotPasswordToken: "",
        status: statusEnum.ACTIVE,
        role: null,
        roleId: row.DesignationID || null,
        phoneCode: "+91",
        phoneNumber: "0000000000",
        address: "Unknown",
        homeAddID: row.HomeAddID || null,
        phonePreferenceRequest: row.PhonePreferenceRequest === "Y",
        internetPreferenceRequest: row.InternetPreferenceRequest === "Y",
        emailPreferenceRequest: row.EmailPreferenceRequest === "Y",
        phonePreferenceUpdate: row.PhonePreferenceUpdate === "Y",
        internetPreferenceUpdate: row.InternetPreferenceUpdate === "Y",
        emailPreferenceUpdate: row.EmailPreferenceUpdate === "Y",
        reportPreference: row.ReportPreference === "Y",
        changepasswordBlocked: row.changepasswordBlocked === "Y",
        uhcEmployeeId: row.uhc_employee_id || null,
        insuDCUHCId: row.UserofInsuDCUHCId || null,
        insuDCUHCflag: row.UserofInsuDCUHCflag === "U",
        officeId: new mongoose.Types.ObjectId(),

      };

      const upserted = await Admin.findOneAndUpdate(
        { contactCode },
        { $set: baseAdminData },
        { upsert: true, new: true }
      );

      adminIdMap.set(
        String(row.ContactId),
        upserted._id as mongoose.Types.ObjectId
      );

      const addr = addressMap.get(String(row.HomeAddID));

      console.log(`Address for ${row.ContactPersonFname}::--`, addr);

      if (!addr) {
        console.warn(
          `No address found for ${row.ContactPersonFname} with HomeAddID ${row.HomeAddID}`
        );
        continue;
      }

      if (addr) {
        await Admin.updateOne(
          { _id: upserted._id },
          {
            $set: {
              address: addr.Address || null,
              address2: addr.Address2 || null,
              city: addr.City || null,
              dist: addr.Dist || null,
              state: addr.State || null,
              pincode: addr.Pincode?.toString() || null,
              phoneNumber: addr.Mobile?.toString() || "0000000000",
              phoneCode: "+91",
              phone: addr.Phone || null,
              fax: addr.Fax || null,
              email: addr.Email || null,
            },
          }
        );
      }
    }

    // Seed Doctors with upsert
    for (const row of doctorJson as any[]) {
      const adminId = adminIdMap.get(String(row.DoctorUserId));
      if (!adminId) {
        console.warn(
          `Skipping doctor ${row.DoctorName} — no matching Admin for userId ${row.DoctorUserId}`
        );
        continue;
      }

      await Doctor.updateOne(
        { dcid: row.Id?.toString() },
        {
          $set: {
            name: row.DoctorName,
            userId: new mongoose.Types.ObjectId(adminId),
            registrationNo: row.DoctorRegistrationNo || null,
            photoUrl: row.DoctorPhotoURL || null,
            signatureUrl: row.DoctorSignatureURL || null,
            stampUrl: row.DoctorStampURL || null,
            isActive: row.IsActive === "Y",
            createdBy: row.CreatedBy || "System",
            type: row.DoctorType || null,
            status: statusEnum.ACTIVE,
            dcid: row.Id?.toString(),
          },
        },
        { upsert: true }
      );
    }

    console.log("✅ Seeding completed successfully.");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  mongoose.disconnect();
});
