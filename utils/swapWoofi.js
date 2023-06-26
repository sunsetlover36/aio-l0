import BigNumber from "bignumber.js";

import { getChainByWallet, sendTx } from "../utils";
import { DEFAULT_SLIPPAGE_MULTIPLIER } from "../constants";
import { approveToken } from "../utils";

export const swapWoofi = async (wallet, { amount, fromToken, toToken }) => {
  const {
    contracts: {
      services: { Woo },
    },
  } = await getChainByWallet(wallet);

  const wooRouterContract = new Contract(
    Woo.WooRouter.address,
    Woo.WooRouter.abi,
    wallet
  );

  await approveToken(wallet, {
    amount,
    token: fromToken,
    spender: Woo.WooRouter.address,
  });

  const amountToReceive = new BigNumber(
    await wooRouterContract.querySwap(
      fromToken.address,
      toToken.address,
      amount
    )
  )
    .multipliedBy(DEFAULT_SLIPPAGE_MULTIPLIER)
    .toString();

  const swapMethodParams = [
    fromToken.address,
    toToken.address,
    amount,
    amountToReceive,
    wallet.address,
    wallet.address,
  ];
  const swapTx = {
    to: Woo.WooRouter.address,
    data: wooRouterContract.interface.encodeFunctionData(
      "swap",
      swapMethodParams
    ),
  };
  await sendTx(wallet, swapTx);

  return amountToReceive;
};
