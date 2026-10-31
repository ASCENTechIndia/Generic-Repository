require("dotenv").config();
const oracledb = require("oracledb");

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE_NAME}`,
  poolAlias: "default",  // <-- Add this line
};

async function initialize() {
  try {
    await oracledb.createPool(dbConfig);
    console.log("Oracle DB Connection Pool Initialized");
  } catch (err) {
    console.error("Oracle DB Connection Error:", err);
    process.exit(1);
  }
}

async function getConnection() {
  return await oracledb.getConnection("default"); // <-- Now it references the pool alias
}

module.exports = {
  initialize,
  getConnection,
};
