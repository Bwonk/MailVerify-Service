/**
 * Test environment setup
 * Configures test database and mocks for testing
 */

// Set test environment variables before loading config
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_NAME = 'email_verification_test';
process.env.AWS_REGION = 'eu-north-1';
process.env.AWS_ACCESS_KEY_ID = 'test_key';
process.env.AWS_SECRET_ACCESS_KEY = 'test_secret';
process.env.SES_FROM_EMAIL = 'no-reply@yigitlabs.com';
process.env.APP_BASE_URL = 'http://localhost:3001';
