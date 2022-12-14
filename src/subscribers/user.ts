import { Container, Inject } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';
import { Logger } from 'winston';

@EventSubscriber()
export default class UserSubscriber {
  constructor(@Inject('userModel') private userModel: Models.UserModel) {}
  @On(events.user.subscribe)
  public onUserSubscription({ _id }: Partial<IUser>): void {
    const Logger: Logger = Container.get('logger');

    try {
      this.userModel.updateOne({ _id }, { $set: { lastNootification: new Date() } });
    } catch (e) {
      Logger.error(`🔥 Error on event ${events.user.subscribe}: %o`, e);

      // Throw the error so the process die (check src/app.ts)
      throw e;
    }
  }
}
