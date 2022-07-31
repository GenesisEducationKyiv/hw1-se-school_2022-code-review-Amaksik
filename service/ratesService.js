const fetch = require('node-fetch');

module.exports.getRates = async function fetchRatesJSON(url, threeLetterCurr1, threeLetterCurr2) {
    const response = await fetch(url + threeLetterCurr1 + "/" + threeLetterCurr2);
    const rate = await response.json();
    return rate;
  }
