import { Container } from 'typedi';
import LoggerInstance from '../../src/loaders/logger';
import RateService from '../../src/services/rate';
import { RateClient } from '../../src/clients/cexio';
import loaders from '../../src/loaders';
import { startServer } from '../../src/app';
import express from 'express';

let body;
beforeAll(async done => {
  //const expressApp = express();
  //await loaders({ expressApp });
  await startServer();
  body = 'BTC';
  done();
});

describe('Rate Service', () => {
  it('should return rates', async () => {
    //Arrange
    const expectedRate: number | string = await fetch('https://cex.io/api/last_price/BTC/USD').then(async result => {
      const response = JSON.parse(await result.json());
      return response.lprice;
    });
    //Act
    const RateClient: RateClient = Container.get('rateClient');
    const rateService = new RateService(LoggerInstance, RateClient);
    const { rate } = await rateService.GetSingleCurrencyRateInUsd(body);
    //Assert
    expect(rate).toBeDefined();
    expect(rate).toBe(expectedRate);
  });
});

//TODO: I really have no idea how to launch app for testing(
