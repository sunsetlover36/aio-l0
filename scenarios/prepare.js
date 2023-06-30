import { formatEther, Wallet } from "ethers";
import BigNumber from "bignumber.js";

import {
  REQUIRED_NATIVE_USD_AMOUNT_FOR_ACCOUNT,
  REQUIRED_STABLE_USD_AMOUNT_FOR_MAIN_ACCOUNT,
} from "../constants";
import { chains } from "../chains";
import { getUsdPrice } from "../api";
import { config } from "../config";
import { getStableToken, getTokenBalance } from "../utils";

const { chainsForInteractions } = config;
export const prepare = async (keysList) => {
  return await Promise.all(
    keysList.map(async (keys) => {
      const { evmKey } = keys;
      const sieve = (
        await Promise.all(
          chainsForInteractions.map(async (chainName) => {
            const chain = chains[chainName];
            const { provider, nativeToken } = chain;
            const evmWallet = new Wallet(evmKey, provider);

            const nativeBalance = formatEther(
              await provider.getBalance(evmWallet.address)
            );
            const usdPrice = await getUsdPrice(nativeToken.coinGeckoId);
            const nativeBalanceInUsd = nativeBalance * usdPrice;

            const stableToken = getStableToken(chain);
            const stableTokenBalance = await getTokenBalance(evmWallet, {
              token: stableToken,
            });

            return nativeBalanceInUsd > REQUIRED_NATIVE_USD_AMOUNT_FOR_ACCOUNT
              ? {
                  name: chainName,
                  canBeRoot: new BigNumber(
                    REQUIRED_STABLE_USD_AMOUNT_FOR_MAIN_ACCOUNT
                  )
                    .multipliedBy(10 ** stableToken.decimals)
                    .lte(stableTokenBalance),
                }
              : undefined;
          })
        )
      )
        .filter((chain) => chain)
        .sort((a) => (a.canBeRoot ? -1 : 1));

      if (sieve.length === 0) {
        throw new Error(
          `No chain found with more than $${REQUIRED_NATIVE_USD_AMOUNT_FOR_ACCOUNT} in native token`
        );
      }
      if (!sieve[0].canBeRoot) {
        throw new Error(
          `No chain found with more than $${REQUIRED_STABLE_USD_AMOUNT_FOR_MAIN_ACCOUNT} in stable token`
        );
      }

      return {
        keys,
        sieve: sieve.map((chain) => chain.name),
      };
    })
  );
};
