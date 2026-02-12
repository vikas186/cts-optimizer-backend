const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  if (err.statusCode) error.statusCode = err.statusCode;

  // Log error
  console.error(err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Sequelize foreign key constraint error (e.g. invalid organization_id on register)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = err.message && err.message.includes('organizations')
      ? 'Organization not found. Please use a valid organization ID.'
      : 'Referenced resource not found. Check that the referenced ID exists.';
    error = { message, statusCode: 404 };
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    const message = 'Database error';
    error = { message, statusCode: 500 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;

