const mongoose = require("mongoose");

const connectMainDB = async () => {

  try {

    const connection = await mongoose.connect(
      `${process.env.MONGO_URL}/main_system`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(
      `Main Database Connected: ${connection.connection.name}`
    );

  } catch (error) {

    console.error(
      "❌ Main Database Connection Failed:",
      error
    );
  }
};

module.exports = connectMainDB;