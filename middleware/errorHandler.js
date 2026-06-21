// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error('Error:', err.message);
  console.error('Stack:', err.stack || 'No stack trace');

  // Determine status code
  const status = err.status || 500;

  // Send response
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;