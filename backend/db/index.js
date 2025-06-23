import mongoose from "mongoose";
const dbConnect = async () => {
  try {
  
    await mongoose.connect(`${process.env.MONGO_URI}`);

    console.log("\nMongodb Connected Successfully ✔✔ ");
  } catch (error) {
    console.log("MongoDB Connection Error ❌❌\n", error);
    process.exit(1);
  }
};
export {dbConnect}