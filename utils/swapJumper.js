import { lifiGetQuote } from "../api";
import { getChainByWallet, sendTx } from "../utils";
import { approveToken } from "../utils";

export const swapJumper = async (
  wallet,
  { amount, fromToken, toToken, toChainId }
) => {
  const {
    chainId,
    contracts: {
      services: { LiFi },
    },
  } = await getChainByWallet(wallet);

  await approveToken(wallet, {
    amount,
    token: fromToken,
    spender: LiFi.Diamond.address,
  });

  const {
    estimate: { toAmountMin },
    transactionRequest,
  } = await lifiGetQuote({
    fromChain: chainId,
    fromAmount: amount,
    fromToken: fromToken.address,
    toChain: toChainId,
    toToken: toToken.address,
    fromAddress: wallet.address,
    toAddress: wallet.address,
  });
  await sendTx(wallet, transactionRequest);

  return toAmountMin;
};
