import { Container, Service, Inject } from 'typedi';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import Agenda from 'agenda';
import { IEmail } from '@/interfaces/IEmail';
import mongoose from 'mongoose';
import RateService from './rate';
import { Logger } from 'winston';

@Service()
export default class MailService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('emailClient') private mailer,
    @Inject('logger') private logger: Logger,
    @Inject('adminPassword') private adminPassword: string,
    @Inject('emailConfig') private mailConfig: Record<string, string>,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async Subscribe(userInputDTO: IUserInputDTO): Promise<IUser> {
    try {
      this.logger.silly('Creating user db record');
      const userRecord = await this.userModel.create({
        ...userInputDTO,
      });

      if (!userRecord) {
        throw new Error('User cannot be created');
      }
      this.logger.silly('Sending welcome email');
      //await this.SendEmail();

      this.eventDispatcher.dispatch(events.user.subscribe, { user: userRecord });

      const user = userRecord.toObject();
      return user;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async SendEmail(email: IEmail): Promise<void> {
    this.mailer
      .send(email)
      .then(() => {
        console.log('Email sent');
      })
      .catch(error => {
        console.error(error);
      });
  }

  public async SendRateUpdateToAll(password: string): Promise<void> {
    this.logger.silly('Checking password');
    if (password !== this.adminPassword) {
      throw new Error('Invalid Password');
    } else {
      this.logger.silly('Password is valid!');
      //In future, I believe this logic should be switched
      //to storing currency, user is subscribed to, in user record in db.
      const rateServiceInstance: RateService = Container.get(RateService);
      const currentRate = await rateServiceInstance.GetSingleCurrencyRateInUsd('BTC');

      const jobObject: { [k: string]: any } = {};
      const emailTemplateWithRate = await this.ConstructEmailTemplate(`Currency rate now is ${currentRate.lprice}`);
      jobObject.mailTemplate = emailTemplateWithRate;

      const agendaInstance: Agenda = Container.get('agendaInstance');
      this.logger.silly('Retrieving receivers from db');
      const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
      try {
        await UserModel.find({}, async function (err, users) {
          if (err) {
            this.logger.debug('Problem with retrieving receivers from db');
            throw new Error(err.message);
          }
          jobObject.users = users.map(model => {
            return model._doc.email;
          });
          agendaInstance.now('send-emails', jobObject);
        });
      } catch (e) {
        this.logger.error(e);
      }
    }
  }
  private async ConstructEmailTemplate(
    html: string = this.mailConfig.html,
    text: string = this.mailConfig.text,
    subject: string = this.mailConfig.subject,
    sender: string = this.mailConfig.from,
  ) {
    return {
      to: '',
      from: sender,
      subject: subject,
      text: text,
      html: html,
    };
  }
}
