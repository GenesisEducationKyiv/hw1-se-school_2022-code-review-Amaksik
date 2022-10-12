import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import MailService from '../../services/mail';
import { IUserInputDTO } from '../../interfaces/IUser';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/mail', route);

  route.post(
    '/subscribe',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling subscription endpoint with body: %o', req.body);
      try {
        const mailServiceInstance = Container.get(MailService);
        const user = await mailServiceInstance.Subscribe(req.body as IUserInputDTO);
        return res.status(201).json({ user });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
