const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { sesClient } = require('../config/aws');
const config = require('../config/env');

/**
 * Send verification email to user
 * @param {string} toEmail - Recipient email address
 * @param {string} token - Verification token
 * @returns {Promise<void>}
 * @throws {Error} If email sending fails
 */
const sendVerificationEmail = async (toEmail, token) => {
  const verificationLink = `https://api.yigitlabs.com/api/auth/verify-email?token=${token}`;
  const emailBody = `Hello,

Thank you for registering! Please verify your email address by clicking the link below:

${verificationLink}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
YigitLabs Team`;

  const params = {
    Source: config.SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [toEmail]
    },
    Message: {
      Subject: {
        Data: 'Verify Your Email Address',
        Charset: 'UTF-8'
      },
      Body: {
        Text: {
          Data: emailBody,
          Charset: 'UTF-8'
        }
      }
    }
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  sendVerificationEmail
};
