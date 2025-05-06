import mongoose from "mongoose";
import { connection } from "../providers/db";
import { Disposition } from "../https/common/commanAPI/models/disposition.modal";

const seedDispositions = async () => {
  try {
    await connection(); // connect to DB

    const dispositionData = [
      { name: "Registered", toSubmit: false },
      { name: "Appointment Confirmed DC Visit", toSubmit: false },
      { name: "Client Have Some Issue With Policy", toSubmit: false },
      { name: "Client is Not Aware For Medical", toSubmit: false },
      { name: "Client is Not Aware For Policy", toSubmit: false },
      { name: "Client is not interested for Medical", toSubmit: false },
      { name: "Client is out of Station or Country", toSubmit: false },
      { name: "Client Want To Cancel The Policy", toSubmit: false },
      { name: "Client Want to Speak With Agent", toSubmit: false },
      { name: "Closed by Insurer", toSubmit: false },
      { name: "DND By HDFC Ergo Medical Team", toSubmit: false },
      {
        name: "Duplicate or SIML Application For Same Client",
        toSubmit: false,
      },
      { name: "Home Visit Not Available", toSubmit: false },
      { name: "Medical Center Not Available", toSubmit: false },
      { name: "Medical Done By Other TPA", toSubmit: false },
      { name: "Wrong or Invalid Number", toSubmit: false },
      { name: "Incomplete Report Received", toSubmit: false },
      { name: "Appointment Not Given By Client", toSubmit: false },
      { name: "Call Back Request By Client", toSubmit: false },
      { name: "Call Back Request By Sales", toSubmit: false },
      { name: "Disconnected Client", toSubmit: false },
      { name: "Engaged Client", toSubmit: false },
      { name: "No Show Rescheduled DC Visit", toSubmit: false },
      { name: "Not Reachable Client", toSubmit: false },
      { name: "Ringing But No Response Client", toSubmit: false },
      { name: "Ringing But No Response Sales", toSubmit: false },
      { name: "Switched Off Client", toSubmit: false },
      { name: "Wrong Number Sales", toSubmit: false },
      { name: "Client Confirmed Medical Already Done", toSubmit: false },
      { name: "Report Uploaded", toSubmit: false },
      { name: "Tele MER Incomplete", toSubmit: false },
      { name: "Tele MER Complete", toSubmit: true },
      { name: "Number does not belong to Proposer", toSubmit: false },
      { name: "QC Query Resolved", toSubmit: false },
      { name: "Maximum call attempts done to the Client", toSubmit: false },
    ];

    for (const item of dispositionData) {
      await Disposition.findOneAndUpdate(
        { name: item.name },
        {
          name: item.name,
          description: null,
          statusReference: "RECEIVED",
          status: "ACTIVE",
          deletedAt: null,
          toSubmit: item.toSubmit,
        },
        { upsert: true, new: true }
      );

      console.log(`Disposition seeded/updated >> ${item.name}`);
    }

    console.log("✅ Disposition seeding completed");
  } catch (error) {
    console.error("❌ Disposition seeding failed");
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDispositions().catch(console.error);
