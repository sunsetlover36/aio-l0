import { Contract, ZeroAddress, ZeroHash, solidityPacked } from "ethers";

import { approveToken, getChainByWallet, sendTx } from "../../utils";
import { chains } from "../../chains";

const harmonyLzChainId = chains.harmony.lzChainId;
export const execute = async (wallet, { token, amount }) => {
  const {
    name,
    contracts: {
      services: { LayerZero, ProxyERC20 },
    },
  } = await getChainByWallet(wallet);
  const isArbitrum = name === chains.arbitrum.name;

  const lzRouterContract = new Contract(
    LayerZero.LZRouter.address,
    LayerZero.LZRouter.abi,
    wallet
  );
  const proxyErc20Contract = new Contract(
    ProxyERC20.address,
    ProxyERC20.abi,
    wallet
  );

  await approveToken(wallet, {
    amount,
    token,
    spender: ProxyERC20.address,
  });

  let adapterParams = "0x";
  if (!isArbitrum) {
    adapterParams = solidityPacked(
      ["uint16", "uint", "uint", "address"],
      [2, 500000, 0, wallet.address]
    );
  }

  const lzBridgeFee = (
    await lzRouterContract.quoteLayerZeroFee(
      harmonyLzChainId,
      1,
      ZeroAddress,
      ZeroHash,
      [500000, 0, wallet.address]
    )
  )[0];
  const bridgeMethodParams = [
    wallet.address,
    harmonyLzChainId,
    wallet.address,
    amount,
    wallet.address,
    ZeroAddress,
    adapterParams,
  ];
  const txParams = {
    value: lzBridgeFee.toString(),
    data: proxyErc20Contract.interface.encodeFunctionData(
      "sendFrom",
      bridgeMethodParams
    ),
    to: ProxyERC20.address,
  };

  await sendTx(
    wallet,
    txParams,
    isArbitrum
      ? {
          baseFee: 6,
          maxPriorityFeePerGas: 6,
          gasLimit: 1400000,
        }
      : undefined
  );
};
