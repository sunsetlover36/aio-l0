import BigNumber from "bignumber.js";

import { chains } from "../../chains";
import {
  getChainByWallet,
  getStableToken,
  getTokenBalance,
  swapWoofi,
} from "../../utils";
import { SLIPPAGE_MULTIPLIER } from "../../constants";

// Prepare things for this interaction (do swaps, etc.)
export const prepare = async (wallet, { amount }) => {
  const bnAmount = new BigNumber(amount);

  const chain = await getChainByWallet(wallet);
  const {
    name,
    contracts: {
      tokens: { USDC, BridgedUSDC },
    },
  } = chain;

  if (chains.arbitrum.name !== name) {
    return { token: getStableToken(chain), amount };
  }

  const bridgedUsdcBalance = await getTokenBalance(wallet, {
    token: BridgedUSDC,
  });
  // Perform Woofi swap from USDC to USDC.e if USDC.e balance less than requested amount
  let bridgeAmount = amount;
  if (bnAmount.multipliedBy(SLIPPAGE_MULTIPLIER).gt(bridgedUsdcBalance)) {
    bridgeAmount = await swapWoofi(wallet, {
      amount,
      fromToken: USDC,
      toToken: BridgedUSDC,
    });
  }

  return { token: BridgedUSDC, amount: bridgeAmount };
};
