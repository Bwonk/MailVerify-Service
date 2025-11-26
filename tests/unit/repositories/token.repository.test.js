/**
 * Unit tests for token.repository.js
 */

const tokenRepository = require('../../../src/repositories/token.repository');
const { clearAll, createTestUser } = require('../../helpers/db.helper');
const bcrypt = require('bcrypt');

describe('Token Repository', () => {
  let testUserId;

  beforeEach(async () => {
    await clearAll();
    const passwordHash = await bcrypt.hash('password123', 10);
    testUserId = await createTestUser({
      email: 'test@example.com',
      passwordHash,
      isVerified: false
    });
  });

  afterEach(async () => {
    await clearAll();
  });

  describe('create', () => {
    it('should create a new token', async () => {
      const token = 'test-token-123';
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      const tokenId = await tokenRepository.create(testUserId, token, expiresAt);
      
      expect(tokenId).toBeDefined();
      expect(typeof tokenId).toBe('number');
      expect(tokenId).toBeGreaterThan(0);
    });
  });

  describe('findByToken', () => {
    it('should find token by token string', async () => {
      const tokenString = 'find-me-token';
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      await tokenRepository.create(testUserId, tokenString, expiresAt);
      const tokenData = await tokenRepository.findByToken(tokenString);
      
      expect(tokenData).toBeDefined();
      expect(tokenData.token).toBe(tokenString);
      expect(tokenData.userId).toBe(testUserId);
      expect(tokenData.used).toBe(false);
      expect(tokenData.user).toBeDefined();
      expect(tokenData.user.email).toBe('test@example.com');
    });

    it('should return null for non-existent token', async () => {
      const tokenData = await tokenRepository.findByToken('non-existent-token');
      
      expect(tokenData).toBeNull();
    });
  });

  describe('markAsUsed', () => {
    it('should mark token as used', async () => {
      const tokenString = 'mark-used-token';
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      const tokenId = await tokenRepository.create(testUserId, tokenString, expiresAt);
      await tokenRepository.markAsUsed(tokenId);
      
      const tokenData = await tokenRepository.findByToken(tokenString);
      expect(tokenData.used).toBe(true);
    });
  });

  describe('deleteExpiredTokens', () => {
    it('should delete expired tokens', async () => {
      const expiredToken = 'expired-token';
      const pastDate = new Date(Date.now() - 1000 * 60 * 60);
      
      await tokenRepository.create(testUserId, expiredToken, pastDate);
      await tokenRepository.deleteExpiredTokens();
      
      const tokenData = await tokenRepository.findByToken(expiredToken);
      expect(tokenData).toBeNull();
    });

    it('should delete used tokens', async () => {
      const usedToken = 'used-token';
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      const tokenId = await tokenRepository.create(testUserId, usedToken, futureDate);
      await tokenRepository.markAsUsed(tokenId);
      await tokenRepository.deleteExpiredTokens();
      
      const tokenData = await tokenRepository.findByToken(usedToken);
      expect(tokenData).toBeNull();
    });

    it('should not delete valid unused tokens', async () => {
      const validToken = 'valid-token';
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      await tokenRepository.create(testUserId, validToken, futureDate);
      await tokenRepository.deleteExpiredTokens();
      
      const tokenData = await tokenRepository.findByToken(validToken);
      expect(tokenData).not.toBeNull();
    });
  });
});
