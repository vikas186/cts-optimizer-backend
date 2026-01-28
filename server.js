require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    
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

