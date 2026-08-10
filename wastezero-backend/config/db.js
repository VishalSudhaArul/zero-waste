const mongoose = require("mongoose");

// Disable buffering so Mongoose queries don't hang for 10s if DB is unreachable
mongoose.set("bufferCommands", false);

const DEFAULT_MONGO_URI = "mongodb+srv://vishaarul2005_db_user:u4r3a1G7EuZsKjqS@zero-waste.jlse4is.mongodb.net/zero-waste?retryWrites=true&w=majority&appName=zero-waste";

const connectDB = async (retryCount = 0) => {
  const maxRetries = 5;
  const mongoURI = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error(`Database connection attempt ${retryCount + 1} failed:`, error.message);
    if (retryCount < maxRetries) {
      console.log(`Retrying MongoDB connection in 3 seconds... (${retryCount + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return connectDB(retryCount + 1);
    } else {
      console.error("MongoDB connection failed after maximum retries.");
    }
  }
};

module.exports = connectDB;