/**
 * Format success response
 * @param {string} message - Success message
 * @param {object} data - Optional data to include in response
 * @returns {object} Formatted success response
 */
function successResponse(message, data = null) {
  const response = {
    success: true,
    message
  };

  if (data) {
    response.data = data;
  }

  return response;
}

/**
 * Format error response
 * @param {string} message - Error message
 * @returns {object} Formatted error response
 */
function errorResponse(message) {
  return {
    success: false,
    message
  };
}

module.exports = {
  successResponse,
  errorResponse
};
