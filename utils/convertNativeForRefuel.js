import BigNumber from "bignumber.js";

import { getUsdPrice } from "../api";

export const convertNativeForRefuel = async ({
  fromChain,
  toChain,
  amount,
}) => {
  const { nativeToken: fromNativeToken } = fromChain;
  const { nativeToken: toNativeToken } = toChain;

  const [fromNativeTokenPrice, toNativeTokenPrice] = await getUsdPrice(
    fromNativeToken.coinGeckoId,
    toNativeToken.coinGeckoId
  );

  const convertedAmount = new BigNumber(amount)
    .dividedBy(10 ** 18)
    .multipliedBy(fromNativeTokenPrice)
    .dividedBy(toNativeTokenPrice)
    .multipliedBy(10 ** 18)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString();

  return convertedAmount;
};
