import ky from "ky-universal";

const cache = {};
export const getUsdPrice = async (...tickers) => {
  const nonCachedTickers = tickers.filter(
    (ticker) => cache[ticker] === undefined
  );

  let data = {};
  if (nonCachedTickers.length > 0) {
    data = await (
      await ky.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${nonCachedTickers.join(
          ","
        )}&vs_currencies=usd`
      )
    ).json();
  }

  return tickers.map((ticker) => {
    if (cache[ticker]) {
      return cache[ticker];
    }

    const usd = data[ticker].usd;
    cache[ticker] = usd;
    return usd;
  });
};
