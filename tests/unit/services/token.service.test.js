/**
 * Unit tests for token.service.js
 */

const tokenService = require('../../../src/services/token.service');

describe('Token Service', () => {
  describe('generateToken', () => {
    it('should generate a 64-character hexadecimal token', () => {
      const token = tokenService.generateToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64);
      expect(/^[a-f0-9]{64}$/.test(token)).toBe(true);
    });

    it('should generate unique tokens', () => {
      const token1 = tokenService.generateToken();
      const token2 = tokenService.generateToken();
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('getExpirationDate', () => {
    it('should return a date 24 hours from now', () => {
      const now = new Date();
      const expirationDate = tokenService.getExpirationDate();
      
      expect(expirationDate).toBeInstanceOf(Date);
      
      const hoursDiff = (expirationDate - now) / (1000 * 60 * 60);
      expect(hoursDiff).toBeGreaterThanOrEqual(23.9);
      expect(hoursDiff).toBeLessThanOrEqual(24.1);
    });
  });
});
