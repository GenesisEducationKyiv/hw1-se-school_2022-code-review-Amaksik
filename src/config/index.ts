import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT, 10),

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Password to perform admin operations like sending enails
   */
  adminPassword: process.env.ADMIN_PASSWORD,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * Agenda.js stuff
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  /**
   * Agendash config
   */
  agendash: {
    user: 'agendash',
    password: '123456',
  },
  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },
  /**
   * Sendgrid email credentials
   */
  emailsClient: {
    apiKey: process.env.SENDGRID_API_KEY,
    sender: process.env.SENDGRID_API_SENDER,
  },
  rateClient: {
    url: process.env.CEXIO_API_URL,
  },
  emailTemplate: {
    to: '', //recipient
    from: process.env.VERIFIED_SENDER, // Change to your verified sender
    subject: '🚨BTC 📈 rate update!',
    text: 'HI There, current rate there',
    html: '<strong>RATE = </strong>',
  },
};
