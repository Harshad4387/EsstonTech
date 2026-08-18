const mongoose = require("mongoose");

const connect = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGO_URL}/forecast`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Database connected successfully: ${connection.connection.name}`);
  } catch (error) {
    
    console.error("❌ Database connection failed:", error);
  }
};

module.exports = connect;
