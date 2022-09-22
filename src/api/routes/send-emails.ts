import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import MailService from '@/services/mail';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/mail', route);

  route.post(
    '/send-updates',
    celebrate({
      body: Joi.object({
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling mailing endpoint with body: %o', req.body);
      try {
        const mailServiceInstance = Container.get(MailService);
        mailServiceInstance.SendRateUpdateToAll(req.body.password).then();
        return res.status(200); //TODO: Investigate why this never returned
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
