import { Service, Inject } from 'typedi';
import { RateClient } from '../clients/cexio';

@Service()
export default class RateService {
  constructor(@Inject('logger') private logger, @Inject('rateClient') private rateClient: RateClient) {}

  public async GetSingleCurrencyRateInUsd(currency3LetterCode: string) {
    try {
      this.logger.silly(`Getting ${currency3LetterCode} rate from client`);
      const queryParameters = `/${currency3LetterCode}/USD`;
      return await this.InvokeApi(RateClient.endpoints.currentPrice, queryParameters);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async GetExchangedCurrencyRate(baseCurrency3LetterCode: string, resultCurrency3LetterCode: string) {
    try {
      this.logger.silly(`Getting ${baseCurrency3LetterCode} rate to ${resultCurrency3LetterCode} client`);
      const queryParameters = `/${baseCurrency3LetterCode}/${resultCurrency3LetterCode}`;
      return await this.InvokeApi(RateClient.endpoints.currentPrice, queryParameters);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private async InvokeApi(endpoint: string, queryParameters: string) {
    try {
      const currencyRateResponse = await this.rateClient.Get(endpoint, queryParameters);
      if (!currencyRateResponse || currencyRateResponse.error != undefined) {
        throw new Error('Rate cannot be found');
      }
      this.logger.silly('Api Invoke succesfull');
      return currencyRateResponse;
    } catch (e) {
      this.logger.silly('Unsuccesfull API invokation');
      this.logger.error(e);
      throw e;
    }
  }
}
