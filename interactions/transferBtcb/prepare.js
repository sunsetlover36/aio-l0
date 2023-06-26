import { Contract } from "ethers";
import BigNumber from "bignumber.js";

import { getChainByWallet, swapJumper } from "../../utils";

export const prepare = async (
  wallet,
  { fromToken, percentAmount, toChainId }
) => {
  const {
    chainId: fromChainId,
    contracts: {
      tokens: { BTCb },
    },
  } = await getChainByWallet(wallet);

  const fromTokenContract = new Contract(
    fromToken.address,
    fromToken.abi,
    wallet
  );
  const fromTokenBalance = await fromTokenContract.balanceOf(wallet.address);
  const fromTokenAmount = new BigNumber(fromTokenBalance)
    .multipliedBy(percentAmount / 100)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString();
  const receivedAmount = await swapJumper(wallet, {
    amount: fromTokenAmount,
    fromToken,
    toToken: BTCb,
    toChainId: fromChainId,
  });

  return { amount: receivedAmount, toChainId };
};
