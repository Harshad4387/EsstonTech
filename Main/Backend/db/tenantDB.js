const mongoose = require("mongoose");

const tenantConnections = {};

const getTenantConnection = async (dbName) => {

  try {

    // Return existing connection
    if (tenantConnections[dbName]) {

      console.log(
        `Using Existing Connection: ${dbName}`
      );

      return tenantConnections[dbName];
    }

    // Create new connection
    const connection = await mongoose.createConnection(
      `${process.env.MONGO_URL}/${dbName}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    tenantConnections[dbName] = connection;

    console.log(
      `Tenant Database Connected: ${dbName}`
    );

    return connection;

  } catch (error) {

    console.error(
      `❌ Tenant DB Connection Failed (${dbName}):`,
      error
    );
  }
};

module.exports = getTenantConnection;