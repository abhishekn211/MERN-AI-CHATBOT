import mongoose from 'mongoose';

async function connectToDatabase() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
      socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Could not connect to Database");
  }
}

export { connectToDatabase };
