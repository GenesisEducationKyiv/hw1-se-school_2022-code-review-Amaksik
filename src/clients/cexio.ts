import fetch from 'node-fetch';
//not sure if it's okay to do in that way
enum Endpoints {
  currentPrice = '/last_price',
  currencyLimits = '/currency_limits',
  ticker = '/ticker',
}
enum BasicCurrenies {
  BITCOIN = 'BTC',
  ETHERUM = 'ETH',
  USDOLLAR = 'USD',
  EURO = 'EUR',
}
export class RateClient {
  url: string;
  public static endpoints = Endpoints;
  public static basicCurrencies = BasicCurrenies;
  constructor(apiconfig: Record<string, string>) {
    this.url = apiconfig.url;
  }
  public async Get(
    endpoint: string,
    parameters: string,
  ): Promise<{
    [key: string]: string;
  }> {
    //this is updated template from CEX.IO documentation
    const headers = {
      Accept: '*/*',
    };
    const requestLink = this.url + endpoint + parameters;
    return await fetch(requestLink, {
      method: 'GET',
      headers: headers,
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return (response.json() as unknown) as {
        [key: string]: string;
      };
    });
  }
}
