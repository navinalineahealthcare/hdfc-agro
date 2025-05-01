import mongoose from "mongoose";
import xlsx from "xlsx";
import path from "path";
import { Admin } from "../https/admin/auth/model/admin.model";
import { Doctor } from "../https/admin/doctor/models/doctor.model";
import { statusEnum } from "../https/common/enums";
import { connection } from "../providers/db";

// import  data  from "../storage/assets/DoctorsLoginDetails.xlsx";

const filePath = path.resolve(__dirname, "../storage/assets/DoctorsLoginDetails.xlsx");
const workbook = xlsx.readFile(filePath);
const adminJson = xlsx.utils.sheet_to_json(workbook.Sheets["AdminData"]);
const doctorJson = xlsx.utils.sheet_to_json(workbook.Sheets["DoctorData"]);
const addressJson = xlsx.utils.sheet_to_json(workbook.Sheets["Address"]);

const seed = async () => {
  try {
    await connection();

    const adminIdMap = new Map<string, mongoose.Types.ObjectId>();

    // Prepare address map for quick lookup
    const addressMap = new Map<string, any>();
    for (const addr of addressJson as any[]) {
      addressMap.set(String(addr.dcid || addr.AddressID), addr);
    }

    // Seed Admins
    const adminDocs = await Promise.all(
      (adminJson as any[]).map(async (row) => {
        const admin = new Admin({
          firstName: row.ContactPersonFname || null,
          lastName: row.ContactPersonLName || null,
          contactCode: row.ContactPersonCode || null,
          email: null,
          password: row.UserPassword || "123456",
          forgotPasswordToken: "",
          status: statusEnum.ACTIVE,
          role: "Super_Admin",
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
        });

        const savedAdmin = await admin.save();

        adminIdMap.set(
          row.ContactId as string,
          savedAdmin._id as mongoose.Types.ObjectId
        );

        // Enrich with address if found
        const addr = addressMap.get(String(row.HomeAddID));
        if (addr) {
          await Admin.updateOne(
            { _id: savedAdmin._id },
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

        return savedAdmin;
      })
    );

    // Seed Doctors
    await Doctor.insertMany(
      (doctorJson as any[]).map((row) => ({
        name: row.DoctorName,
        userId: adminIdMap.get(String(row.DoctorUserId)) || null,
        registrationNo: row.DoctorRegistrationNo || null,
        photoUrl: row.DoctorPhotoURL || null,
        signatureUrl: row.DoctorSignatureURL || null,
        stampUrl: row.DoctorStampURL || null,
        isActive: row.IsActive === "Y",
        createdBy: row.CreatedBy || "System",
        type: row.DoctorType || null,
        status: statusEnum.ACTIVE,
        dcid: row.Id?.toString(),
      }))
    );
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }

  console.log("✅ Seeding completed successfully.");
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  mongoose.disconnect();
});
