const mongoose = require("mongoose");

const OLD_DB = "mongodb://127.0.0.1:27017/forecast";
const NEW_DB = "mongodb://127.0.0.1:27017/esston";

async function migrateDatabase() {
  try {

    // Connect Old Database
    const oldConnection = await mongoose.createConnection(OLD_DB);

    // Connect New Database
    const newConnection = await mongoose.createConnection(NEW_DB);

    console.log("Both Databases Connected");

    // Get All Collections
    const collections = await oldConnection.db
      .listCollections()
      .toArray();

    for (const collection of collections) {

      const collectionName = collection.name;

      console.log(`Copying Collection: ${collectionName}`);

      // Fetch documents from old DB
      const documents = await oldConnection.db
        .collection(collectionName)
        .find({})
        .toArray();

      if (documents.length > 0) {

        // Insert into new DB
        await newConnection.db
          .collection(collectionName)
          .insertMany(documents);

        console.log(
          `${documents.length} documents copied from ${collectionName}`
        );

      } else {

        console.log(`No documents in ${collectionName}`);
      }
    }

    console.log("Database Migration Completed Successfully");

    process.exit();

  } catch (error) {

    console.log("Migration Error:", error);

    process.exit(1);
  }
}

migrateDatabase();