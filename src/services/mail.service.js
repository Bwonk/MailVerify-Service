const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { sesClient } = require('../config/aws');
const config = require('../config/env');

/**
 * 
 * @param {string} toEmail 
 * @param {string} token 
 * @returns {Promise<void>}
 * @throws {Error} 
 */
const sendVerificationEmail = async (toEmail, token) => {
  const verificationLink = `https://api.yigitlabs.com/api/auth/verify-email?token=${token}`;
  const emailBody = `Merhaba,

YigitLabs'e kayıt olduğunuz için teşekkür ederiz. E-posta adresinizi doğrulamak için aşağıdaki bağlantıya tıklayın:

${verificationLink}

Bu bağlantı 24 saat boyunca geçerlidir.

Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı dikkate almayabilirsiniz.

İyi günler dileriz,
YigitLabs Ekibi`;

  const params = {
    Source: config.SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [toEmail]
    },
    Message: {
      Subject: {
        Data: 'E-posta Adresinizi Doğrulayın',
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
    console.error('Doğrulama e-postası gönderilemedi:', error);
    throw new Error('Doğrulama e-postası gönderilemedi');
  }
};

module.exports = {
  sendVerificationEmail
};
