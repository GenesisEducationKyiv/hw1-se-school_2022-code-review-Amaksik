import { Container } from 'typedi';
import { Logger } from 'winston';
import { IEmail } from '../interfaces/IEmail';
import MailService from '../services/mail';

export default class EmailSequenceJob {
  public async handler(job, done): Promise<void> {
    const Logger: Logger = Container.get('logger');
    try {
      Logger.debug('✌️ Email Sequence Job triggered!');
      const mailingList: [string] = job.attrs.data.users;
      const mailTemplate: IEmail = job.attrs.data.mailTemplate;
      const mailServiceInstance = Container.get(MailService);
      mailingList.forEach(async function (receiver) {
        mailTemplate.to = receiver;
        await mailServiceInstance.SendEmail(mailTemplate);
      });
      done();
    } catch (e) {
      Logger.error('🔥 Error with Email Sequence Job: %o', e);
      done(e);
    }
  }
}
