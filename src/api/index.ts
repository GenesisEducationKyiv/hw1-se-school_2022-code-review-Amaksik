import { Router } from 'express';
import subscribe from './routes/subscribe';
import rate from './routes/rate';
import agendash from './routes/agendash';
import sendEmails from './routes/send-emails';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  subscribe(app);
  sendEmails(app);
  rate(app);
  agendash(app);

  return app;
};
