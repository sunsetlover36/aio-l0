import { getChainByWallet, swapJumper } from "../../utils";

export const prepare = async (wallet, { token, amount }) => {
  const {
    contracts: {
      tokens: { STG },
    },
    chainId,
  } = await getChainByWallet(wallet);

  await swapJumper(wallet, {
    amount,
    fromToken: token,
    toToken: STG,
    toChainId: chainId,
  });
};
