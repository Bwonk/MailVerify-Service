/**
 * Unit tests for user.repository.js
 */

const userRepository = require('../../../src/repositories/user.repository');
const { clearAll } = require('../../helpers/db.helper');
const bcrypt = require('bcrypt');

describe('User Repository', () => {
  beforeEach(async () => {
    await clearAll();
  });

  afterEach(async () => {
    await clearAll();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const email = 'test@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      
      const userId = await userRepository.create(email, passwordHash);
      
      expect(userId).toBeDefined();
      expect(typeof userId).toBe('number');
      expect(userId).toBeGreaterThan(0);
    });

    it('should create user with is_verified set to false', async () => {
      const email = 'newuser@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      
      const userId = await userRepository.create(email, passwordHash);
      const user = await userRepository.findByEmail(email);
      
      expect(user.isVerified).toBe(false);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'findme@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      
      await userRepository.create(email, passwordHash);
      const user = await userRepository.findByEmail(email);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.passwordHash).toBe(passwordHash);
      expect(user.isVerified).toBe(false);
    });

    it('should return null for non-existent email', async () => {
      const user = await userRepository.findByEmail('nonexistent@example.com');
      
      expect(user).toBeNull();
    });
  });

  describe('updateVerificationStatus', () => {
    it('should update user verification status to true', async () => {
      const email = 'verify@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      
      const userId = await userRepository.create(email, passwordHash);
      await userRepository.updateVerificationStatus(userId, true);
      
      const user = await userRepository.findByEmail(email);
      expect(user.isVerified).toBe(true);
    });

    it('should update user verification status to false', async () => {
      const email = 'unverify@example.com';
      const passwordHash = await bcrypt.hash('password123', 10);
      
      const userId = await userRepository.create(email, passwordHash);
      await userRepository.updateVerificationStatus(userId, true);
      await userRepository.updateVerificationStatus(userId, false);
      
      const user = await userRepository.findByEmail(email);
      expect(user.isVerified).toBe(false);
    });
  });
});
