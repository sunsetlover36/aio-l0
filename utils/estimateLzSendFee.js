import { Contract } from "ethers";

import { getChainByWallet } from "./getChainByWallet";

export const estimateLzSendFee = async (wallet) => {
  const {
    contracts: {
      services: { LayerZero },
    },
    name,
    lzChainId,
  } = await getChainByWallet(wallet);

  const lzEndpointContract = new Contract(
    LayerZero.LZEndpoint.address,
    LayerZero.LZEndpoint.abi,
    wallet
  );
  const lzSendFee = (
    await lzEndpointContract.estimateFees(
      lzChainId,
      wallet.address,
      "0x",
      false,
      "0x"
    )
  )[0];

  return lzSendFee;
};
