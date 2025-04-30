import Database from 'better-sqlite3';

const db = new Database('./data/cars.db');

// Define the schema for the Cars table
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS Cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      modelPath TEXT,
      bodyColor TEXT,
      wheelColor TEXT,
      accessories TEXT,
      shared INTEGER
    )
  `);
} catch (error) {
  console.error("Error creating Cars table:", error);
}

// Define the schema for the CarConfigs table
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS CarConfigs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      carName TEXT,
      config TEXT,
      isShared INTEGER
    )
  `);
} catch (error) {
  console.error("Error creating CarConfigs table:", error);
}

// Define the schema for the Configs table
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS Configs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      userEmail TEXT,
      userName TEXT,
      modelName TEXT,
      bodyColor TEXT,
      wheelColor TEXT,
      wheelScale REAL,
      finishType TEXT,
      wheels TEXT,
      headlights TEXT,
      interiorColor TEXT,
      accessories TEXT,
      isShared INTEGER,
      createdAt TEXT
    )
  `);
} catch (error) {
  console.error("Error creating Configs table:", error);
}

export default db;