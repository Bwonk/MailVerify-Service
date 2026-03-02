require('dotenv').config();

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'SES_FROM_EMAIL',
  'APP_BASE_URL' ,
  'API_BASE_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    'Please check your .env file and ensure all required variables are set.'
  );
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10),
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  SES_FROM_EMAIL: process.env.SES_FROM_EMAIL,
  APP_BASE_URL: process.env.APP_BASE_URL ,
  API_BASE_URL: process.env.API_BASE_URL
};
