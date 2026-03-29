require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');
const models = require('./src/models');

const PORT = process.env.PORT || 4000;

// Test database connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    
    // Sync database using ALTER (updates existing tables without dropping data)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database models synchronized successfully.');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  });

