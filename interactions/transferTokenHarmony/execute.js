import { Contract, ZeroAddress, ZeroHash, solidityPacked } from "ethers";

import { approveToken, getChainByWallet, sendTx } from "../../utils";

export const execute = async (wallet, { token, amount }) => {
  const {
    contracts: {
      services: { LayerZero, ProxyERC20 },
    },
    lzChainId: harmonyLzChainId,
  } = await getChainByWallet(wallet);

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

  const adapterParams = solidityPacked(
    ["uint16", "uint", "uint", "address"],
    [2, 200000, 0, wallet.address]
  );
  const lzBridgeFee = (
    await lzRouterContract.quoteLayerZeroFee(
      harmonyLzChainId,
      1,
      ZeroAddress,
      ZeroHash,
      [0, 0, wallet.address]
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

  await sendTx(wallet, txParams);
};
