/**
 * Integration tests for authentication API endpoints
 */

const request = require('supertest');
const bcrypt = require('bcrypt');
const { clearAll, createTestUser, createTestToken } = require('../helpers/db.helper');
const { mockSESClient } = require('../mocks/ses.mock');

// Mock AWS SES before loading app
vi.mock('../../src/config/aws', () => ({
  sesClient: mockSESClient
}));

const app = require('../../src/app');

describe('Authentication API', () => {
  beforeEach(async () => {
    await clearAll();
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await clearAll();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Verification email sent.');
    });

    it('should return error for duplicate verified email', async () => {
      const email = 'verified@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      
      await createTestUser({
        email,
        passwordHash,
        isVerified: true
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'newpassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already registered');
    });

    it('should resend verification for duplicate unverified email', async () => {
      const email = 'unverified@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      
      await createTestUser({
        email,
        passwordHash,
        isVerified: false
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email,
          password: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Verification email sent.');
    });

    it('should return validation error for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return validation error for short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return validation error for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/verify-email', () => {
    it('should verify email with valid token', async () => {
      const email = 'verify@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      const token = 'valid-token-123';
      
      const userId = await createTestUser({
        email,
        passwordHash,
        isVerified: false
      });
      
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await createTestToken({
        userId,
        token,
        expiresAt,
        used: false
      });

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({ token });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Email verified.');
    });

    it('should return error for invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: 'invalid-token' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired token');
    });

    it('should return error for expired token', async () => {
      const email = 'expired@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      const token = 'expired-token-123';
      
      const userId = await createTestUser({
        email,
        passwordHash,
        isVerified: false
      });
      
      const expiresAt = new Date(Date.now() - 1000 * 60 * 60);
      await createTestToken({
        userId,
        token,
        expiresAt,
        used: false
      });

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({ token });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired token');
    });

    it('should return error for used token', async () => {
      const email = 'used@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      const token = 'used-token-123';
      
      const userId = await createTestUser({
        email,
        passwordHash,
        isVerified: false
      });
      
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await createTestToken({
        userId,
        token,
        expiresAt,
        used: true
      });

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({ token });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already used');
    });

    it('should return validation error for missing token', async () => {
      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/resend-verification', () => {
    it('should resend verification for unverified user', async () => {
      const email = 'unverified@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      
      await createTestUser({
        email,
        passwordHash,
        isVerified: false
      });

      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Verification email sent.');
    });

    it('should return success for non-existent user (enumeration protection)', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Verification email sent.');
    });

    it('should return success for verified user (enumeration protection)', async () => {
      const email = 'verified@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      
      await createTestUser({
        email,
        passwordHash,
        isVerified: true
      });

      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Verification email sent.');
    });

    it('should return validation error for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return validation error for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });
});
