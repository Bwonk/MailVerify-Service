/**
 * Unit tests for mail.service.js
 */

const { mockSESClient } = require('../../mocks/ses.mock');

// Mock the AWS config before requiring mail service
vi.mock('../../../src/config/aws', () => ({
  sesClient: mockSESClient
}));

const mailService = require('../../../src/services/mail.service');
const config = require('../../../src/config/env');

describe('Mail Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email with correct parameters', async () => {
      const toEmail = 'test@example.com';
      const token = 'test-token-123';
      
      const sendSpy = vi.spyOn(mockSESClient, 'send');
      
      await mailService.sendVerificationEmail(toEmail, token);
      
      expect(sendSpy).toHaveBeenCalledTimes(1);
      
      const command = sendSpy.mock.calls[0][0];
      expect(command.input.Source).toBe(config.SES_FROM_EMAIL);
      expect(command.input.Destination.ToAddresses).toContain(toEmail);
      expect(command.input.Message.Subject.Data).toBe('Verify Your Email Address');
      expect(command.input.Message.Body.Text.Data).toContain(token);
      expect(command.input.Message.Body.Text.Data).toContain(config.APP_BASE_URL);
    });

    it('should include verification link in email body', async () => {
      const toEmail = 'test@example.com';
      const token = 'test-token-456';
      
      const sendSpy = vi.spyOn(mockSESClient, 'send');
      
      await mailService.sendVerificationEmail(toEmail, token);
      
      const command = sendSpy.mock.calls[0][0];
      const emailBody = command.input.Message.Body.Text.Data;
      const expectedLink = `${config.APP_BASE_URL}/verify-email?token=${token}`;
      
      expect(emailBody).toContain(expectedLink);
    });
  });
});
