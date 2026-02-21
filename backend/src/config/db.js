const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};

// Optional: Handle DB connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB Disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB Reconnected");
});

module.exports = connectDB;