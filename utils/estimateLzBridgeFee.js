import { Contract, ZeroAddress, ZeroHash } from "ethers";

import { getChainByWallet } from "./getChainByWallet";

export const estimateLzBridgeFee = async (wallet, { toChain }) => {
  const {
    contracts: {
      services: { LayerZero },
    },
  } = await getChainByWallet(wallet);
  const { lzChainId: toLzChainId } = toChain;

  const lzRouterContract = new Contract(
    LayerZero.LZRouter.address,
    LayerZero.LZRouter.abi,
    wallet
  );
  const lzBridgeFee = await lzRouterContract.quoteLayerZeroFee(
    toLzChainId,
    1,
    ZeroAddress,
    ZeroHash,
    [0, 0, wallet.address]
  );

  return lzBridgeFee[0];
};
