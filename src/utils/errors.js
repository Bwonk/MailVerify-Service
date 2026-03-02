/**
 * Doğrulama hataları için özel hata sınıfı
 * Girdi doğrulaması başarısız olduğunda kullanılır (Zod şema doğrulaması)
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

/**
 * Uygulama hataları için özel hata sınıfı
 * Belirli durum kodlarına sahip iş mantığı hatalarında kullanılır
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

module.exports = {
  ValidationError,
  AppError
};
