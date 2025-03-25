require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./config/config');

// Determine environment (development locally, production on Railway)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

// Load models (optional, if you want to define them here)
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Example: Import models (uncomment and adjust paths if needed)
// db.Customer = require('./models/customer')(sequelize, Sequelize);
// db.Order = require('./models/order')(sequelize, Sequelize);
// ... other models

module.exports = db;