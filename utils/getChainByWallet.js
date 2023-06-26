import { getChainById } from "./getChainById";

export const getChainByWallet = async (wallet) => {
  const { chainId } = await wallet.provider.getNetwork();
  return getChainById(chainId);
};
