const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function listDatabasesAndCollections() {
    try {
        const client = new MongoClient(uri);
        await client.connect();

        // List all databases
        const databases = await client.db().admin().listDatabases();
        console.log("\n📌 Databases:");
        databases.databases.forEach(db => console.log(`- ${db.name}`));

        // Loop through each database and list its collections
        for (const dbInfo of databases.databases) {
            const dbName = dbInfo.name;
            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            console.log(`\n📂 Collections in Database: ${dbName}`);
            if (collections.length === 0) {
                console.log("  (No collections found)");
            } else {
                collections.forEach(col => console.log(`  - ${col.name}`));
            }
        }

        await client.close();
    } catch (error) {
        console.error("Error listing databases and collections:", error);
    }
}

// Run the function
listDatabasesAndCollections();
