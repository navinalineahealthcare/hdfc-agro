// import mongoose from "mongoose";


// const seed = async () => {
//     try {
//         await connection();
//         for (const data of policyPagesData) {
//             await PolicyPage.create(
//                 {
//                     title: data.title,
//                     description: data.description,
//                     page: data.page,
//                     type: data.type
//                 }
//             );
//             console.log(`Policy page added>>${data.page} from ${data.type}`);

//         }
//         console.log("Policy page seeding completed");
//     } catch (e) {
//         console.log("Policy page seeding failed");
//         console.error(e);
//     } finally {
//         await mongoose.connection.close();
//     }
// };

// seed().catch(console.error);