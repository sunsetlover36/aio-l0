import { Contract, formatEther, Wallet } from "ethers";
import BigNumber from "bignumber.js";

import {
  REQUIRED_USD_AMOUNT_FOR_MAIN_ACCOUNT,
  REQUIRED_USD_AMOUNT_FOR_SECONDARY_ACCOUNT,
} from "../constants";
import { chains } from "../chains";
import { getUsdPrice } from "../api";
import { config } from "../config";

const { chainsForInteractions } = config;
export const prepare = async (keysList) => {
  return await Promise.all(
    keysList.map(async (keys) => {
      const { evmKey } = keys;
      const sieve = (
        await Promise.all(
          chainsForInteractions.map(async (chainName) => {
            const {
              provider,
              nativeToken,
              contracts: {
                tokens: { USDC },
              },
            } = chains[chainName];
            const evmWallet = new Wallet(evmKey, provider);

            const nativeBalance = formatEther(
              await provider.getBalance(evmWallet.address)
            );
            const usdPrice = await getUsdPrice(nativeToken.coinGeckoId);
            const nativeBalanceInUsd = nativeBalance * usdPrice;

            const usdcContract = new Contract(
              USDC.address,
              USDC.abi,
              evmWallet
            );
            const usdcBalance = await usdcContract.balanceOf(evmWallet.address);

            return nativeBalanceInUsd >
              REQUIRED_USD_AMOUNT_FOR_SECONDARY_ACCOUNT
              ? {
                  name: chainName,
                  canBeRoot: new BigNumber(REQUIRED_USD_AMOUNT_FOR_MAIN_ACCOUNT)
                    .multipliedBy(10 ** USDC.decimals)
                    .lte(usdcBalance),
                }
              : undefined;
          })
        )
      )
        .filter((chain) => chain)
        .sort((a) => (a.canBeRoot ? -1 : 1));

      if (!sieve[0].canBeRoot) {
        throw new Error(
          `No chain found with more than $${REQUIRED_USD_AMOUNT_FOR_MAIN_ACCOUNT} in stable token`
        );
      }

      return {
        keys,
        sieve: sieve.map((chain) => chain.name),
      };
    })
  );
};
