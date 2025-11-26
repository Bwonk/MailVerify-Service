const { SESClient } = require('@aws-sdk/client-ses');
const config = require('./env');

/**
 * AWS SES client configuration
 */
const sesClient = new SESClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  }
});

module.exports = {
  sesClient
};
