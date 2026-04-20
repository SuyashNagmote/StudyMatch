import mongoose from "mongoose";

export const connectDB = async () => {
  if (process.env.DATA_MODE === "file") {
    console.log("Using local file data store");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed, falling back to local file data store", error.message);
  }
};
