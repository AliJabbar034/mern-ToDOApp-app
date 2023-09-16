import mongoose from "mongoose";

export const createConnection = async () => {
  const Db = process.env.MONGO_URL.replace(
    "<password>",
    process.env.MONGO_PASS
  );
  try {
    const connect = await mongoose.connect(Db);
    console.log("Connected");
  } catch (error) {
    console.log("error during connecting to Database. Exiting", error.message);
    process.exit(1);
  }
};
