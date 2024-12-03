const path = require("path");
const fs = require("fs");

async function setupDb() {
  const { Low } = await import("lowdb");
  const { JSONFile } = await import("lowdb/node");

  // Define the file path for the JSON storage
  const filePath = path.join(__dirname, "../data/db.json");

  // Create the file with default structure if it doesn't exist
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ users: [] }, null, 2)); // Initialize with default users array
  }

  // Setup the adapter and LowDB instance
  const adapter = new JSONFile(filePath);
  const db = new Low(adapter, { users: [] });

  // Read the database
  await db.read();

  // Ensure db.data is always initialized
  if (!db.data) {
    db.data = { users: [] }; // Initialize with default structure if db.data is empty
    await db.write(); // Write the initialized structure to the file
  }

  return db;
}

module.exports = setupDb;
