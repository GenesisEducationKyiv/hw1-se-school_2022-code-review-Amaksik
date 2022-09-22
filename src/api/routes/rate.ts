import RateService from '@/services/rate';
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { Logger } from 'winston';
const route = Router();

export default (app: Router) => {
  app.use('/rates', route);

  route.get('/:currency3LetterCode', async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling rates endpoint with currency: %o', req.params.currency3LetterCode);
    try {
      const rateServiceInstance = Container.get(RateService);
      const currentRate = await rateServiceInstance.GetSingleCurrencyRateInUsd(
        req.params.currency3LetterCode.toUpperCase(),
      );
      return res.status(201).json(currentRate.lprice);
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
  route.get(
    '/:baseCurrency3LetterCode/:resultCurrency3LetterCode',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling rates endpoint with currency: %o', req.params.currency3LetterCode);
      try {
        const rateService = Container.get(RateService);
        const currentRate = await rateService.GetExchangedCurrencyRate(
          req.params.baseCurrency3LetterCode.toUpperCase(),
          req.params.resultCurrency3LetterCode.toUpperCase(),
        );
        return res.status(201).json(currentRate.lprice);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
