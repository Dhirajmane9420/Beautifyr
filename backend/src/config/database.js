import mongoose from "mongoose";

export const connectDatabase = async (mongoUri) => {
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

export const disconnectDatabase = async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
};
