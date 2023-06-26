import BigNumber from "bignumber.js";
import { Wallet } from "ethers";

import { DEFAULT_SLIPPAGE } from "../../constants";
import { chains } from "../../chains";
import { chainToColor } from "../../constants";
import {
  getChainByWallet,
  getTokenBalance,
  randint,
  swapJumper,
} from "../../utils";
import { config } from "../../config";
import { lockStg } from "../lockStg";
import { transferBtcb } from "../transferBtcb";
import { transferTokenAptos } from "../transferTokenAptos";
import { transferTokenHarmony } from "../transferTokenHarmony";
import { execute } from "./execute";

const { stablesForInteraction } = config;

export const bridgeStablesForInteraction = async (
  wallet,
  { interactionName, stableToken, availableChains, log }
) => {
  const bnMinStableRequiredForInteraction = new BigNumber(
    randint(stablesForInteraction.min, stablesForInteraction.max)
  ).multipliedBy(10 ** stableToken.decimals);
  const minStableRequiredForInteraction =
    bnMinStableRequiredForInteraction.toString();

  const { chainId } = await getChainByWallet(wallet);

  const stableTokenBalance = await getTokenBalance(wallet, {
    token: stableToken,
  });

  // Check if interaction requires non-zero stable token amount & check stable token balance
  // Bridge if balance < required amount
  if (
    [
      lockStg.name,
      transferBtcb.name,
      transferTokenAptos.name,
      transferTokenHarmony.name,
    ].includes(interactionName) &&
    bnMinStableRequiredForInteraction.gt(stableTokenBalance)
  ) {
    const chainsWithStableBalance = (
      await Promise.all(
        availableChains.map(async (chainName) => {
          const chain = chains[chainName];
          const {
            provider,
            contracts: {
              tokens: { USDC },
            },
          } = chain;

          const chainWallet = new Wallet(wallet.privateKey, provider);
          const chainStableTokenBalance = await getTokenBalance(chainWallet, {
            token: USDC,
          });

          if (bnMinStableRequiredForInteraction.lt(chainStableTokenBalance)) {
            return chain;
          }
        })
      )
    ).filter((chain) => chain);

    if (chainsWithStableBalance.length > 0) {
      const {
        name: rootChainName,
        provider: rootChainProvider,
        contracts: {
          tokens: { USDC: RootChainUSDC, USDT: RootChainUSDT },
        },
        chainId: rootChainId,
      } = chainsWithStableBalance[0];
      const rootWallet = new Wallet(wallet.privateKey, rootChainProvider);

      log(
        `Required ${bnMinStableRequiredForInteraction.dividedBy(
          10 ** stableToken.decimals
        )} USDC from ${chainToColor[rootChainName.toLowerCase()](
          rootChainName.toUpperCase()
        )}`
      );

      const isBsc = rootChainName === chains.bsc.name;
      // Swap USDC to USDT for Stargate bridge
      if (isBsc) {
        await swapJumper(rootWallet, {
          amount: minStableRequiredForInteraction,
          fromToken: RootChainUSDC,
          toToken: RootChainUSDT,
          toChainId: rootChainId,
        });
      }
      await execute(rootWallet, {
        fromToken: isBsc ? RootChainUSDT : RootChainUSDC,
        toToken: stableToken,
        toChainId: chainId,
        amount: bnMinStableRequiredForInteraction
          .multipliedBy(1 + DEFAULT_SLIPPAGE / 100)
          .toString(),
      });
      await waitForBalance(wallet, {
        token: stableToken,
        minStableRequiredForInteraction,
      });
    }
  }
};
