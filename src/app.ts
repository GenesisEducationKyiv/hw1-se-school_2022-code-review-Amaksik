import 'reflect-metadata'; // We need this in order to use @Decorators

import config from './config';

import express from 'express';

import Logger from './loaders/logger';

export async function startServer() {
  const app = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node without babel and at the time of writing
   **/
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await require('./loaders').default({ expressApp: app });

  app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
