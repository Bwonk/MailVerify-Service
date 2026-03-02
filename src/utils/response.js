/**
 * Başarılı yanıtı biçimlendirir
 * @param {string} message 
 * @param {object} data 
 * @returns {object} 
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
 * Hata yanıtını biçimlendirir
 * @param {string} message - Hata mesajı
 * @returns {object} 
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
