/**
 * Unit tests for auth.service.js
 */

const bcrypt = require('bcrypt');

// Mock dependencies
const mockUserRepository = {
  findByEmail: vi.fn(),
  create: vi.fn(),
  updateVerificationStatus: vi.fn()
};

const mockTokenRepository = {
  create: vi.fn(),
  findByToken: vi.fn(),
  markAsUsed: vi.fn()
};

const mockTokenService = {
  generateToken: vi.fn(),
  getExpirationDate: vi.fn()
};

const mockMailService = {
  sendVerificationEmail: vi.fn()
};

vi.mock('../../../src/repositories/user.repository', () => mockUserRepository);
vi.mock('../../../src/repositories/token.repository', () => mockTokenRepository);
vi.mock('../../../src/services/token.service', () => mockTokenService);
vi.mock('../../../src/services/mail.service', () => mockMailService);

const authService = require('../../../src/services/auth.service');
const { AppError } = require('../../../src/utils/errors');

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTokenService.generateToken.mockReturnValue('mock-token-123');
    mockTokenService.getExpirationDate.mockReturnValue(new Date(Date.now() + 24 * 60 * 60 * 1000));
  });

  describe('register', () => {
    it('should create new user and send verification email', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';
      
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(1);
      mockTokenRepository.create.mockResolvedValue(1);
      mockMailService.sendVerificationEmail.mockResolvedValue();
      
      const result = await authService.register(email, password);
      
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockTokenRepository.create).toHaveBeenCalled();
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(email, 'mock-token-123');
      expect(result).toEqual({
        success: true,
        message: 'Verification email sent.'
      });
    });

    it('should throw error if email already registered and verified', async () => {
      const email = 'verified@example.com';
      const password = 'password123';
      
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email,
        isVerified: true
      });
      
      await expect(authService.register(email, password)).rejects.toThrow(AppError);
      await expect(authService.register(email, password)).rejects.toThrow('Email already registered');
    });

    it('should resend verification email for unverified user', async () => {
      const email = 'unverified@example.com';
      const password = 'password123';
      
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 2,
        email,
        isVerified: false
      });
      mockTokenRepository.create.mockResolvedValue(2);
      mockMailService.sendVerificationEmail.mockResolvedValue();
      
      const result = await authService.register(email, password);
      
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockTokenRepository.create).toHaveBeenCalled();
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(email, 'mock-token-123');
      expect(result).toEqual({
        success: true,
        message: 'Verification email sent.'
      });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      const token = 'valid-token';
      const futureDate = new Date(Date.now() + 1000 * 60 * 60);
      
      mockTokenRepository.findByToken.mockResolvedValue({
        id: 1,
        userId: 1,
        token,
        expiresAt: futureDate,
        used: false
      });
      mockUserRepository.updateVerificationStatus.mockResolvedValue();
      mockTokenRepository.markAsUsed.mockResolvedValue();
      
      const result = await authService.verifyEmail(token);
      
      expect(mockTokenRepository.findByToken).toHaveBeenCalledWith(token);
      expect(mockUserRepository.updateVerificationStatus).toHaveBeenCalledWith(1, true);
      expect(mockTokenRepository.markAsUsed).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        success: true,
        message: 'Email verified.'
      });
    });

    it('should throw error for invalid token', async () => {
      mockTokenRepository.findByToken.mockResolvedValue(null);
      
      await expect(authService.verifyEmail('invalid-token')).rejects.toThrow(AppError);
      await expect(authService.verifyEmail('invalid-token')).rejects.toThrow('Invalid or expired token');
    });

    it('should throw error for used token', async () => {
      mockTokenRepository.findByToken.mockResolvedValue({
        id: 1,
        userId: 1,
        token: 'used-token',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        used: true
      });
      
      await expect(authService.verifyEmail('used-token')).rejects.toThrow(AppError);
      await expect(authService.verifyEmail('used-token')).rejects.toThrow('Token already used');
    });

    it('should throw error for expired token', async () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60);
      
      mockTokenRepository.findByToken.mockResolvedValue({
        id: 1,
        userId: 1,
        token: 'expired-token',
        expiresAt: pastDate,
        used: false
      });
      
      await expect(authService.verifyEmail('expired-token')).rejects.toThrow(AppError);
      await expect(authService.verifyEmail('expired-token')).rejects.toThrow('Invalid or expired token');
    });
  });

  describe('resendVerification', () => {
    it('should send verification email for unverified user', async () => {
      const email = 'unverified@example.com';
      
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email,
        isVerified: false
      });
      mockTokenRepository.create.mockResolvedValue(1);
      mockMailService.sendVerificationEmail.mockResolvedValue();
      
      const result = await authService.resendVerification(email);
      
      expect(mockTokenRepository.create).toHaveBeenCalled();
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(email, 'mock-token-123');
      expect(result).toEqual({
        success: true,
        message: 'Verification email sent.'
      });
    });

    it('should return success for non-existent user (enumeration protection)', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      const result = await authService.resendVerification('nonexistent@example.com');
      
      expect(mockTokenRepository.create).not.toHaveBeenCalled();
      expect(mockMailService.sendVerificationEmail).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Verification email sent.'
      });
    });

    it('should return success for verified user (enumeration protection)', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'verified@example.com',
        isVerified: true
      });
      
      const result = await authService.resendVerification('verified@example.com');
      
      expect(mockTokenRepository.create).not.toHaveBeenCalled();
      expect(mockMailService.sendVerificationEmail).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'Verification email sent.'
      });
    });
  });
});
