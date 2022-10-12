import { Container } from 'typedi';
import MailClient from '@sendgrid/mail';
import LoggerInstance from './logger';
import agendaFactory from './agenda';
import config from '../config';
import { RateClient } from '../clients/cexio';

export default ({ mongoConnection, models }: { mongoConnection; models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    const agendaInstance = agendaFactory({ mongoConnection });
    MailClient.setApiKey(config.emailsClient.apiKey);

    Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);
    Container.set('emailClient', MailClient);
    Container.set('rateClient', new RateClient(config.rateClient));

    Container.set('adminPassword', config.adminPassword);
    Container.set('emailConfig', config.emailTemplate);

    LoggerInstance.info('✌️ Agenda injected into container');

    return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
