import BigNumber from "bignumber.js";
import { Contract, Wallet, ZeroAddress, ZeroHash } from "ethers";

import { config } from "../../config";
import { SLIPPAGE_MULTIPLIER } from "../../constants";
import {
  approveToken,
  getChainById,
  getChainByWallet,
  sendTx,
  waitForBalance,
} from "../../utils";

const { slippage } = config;
export const execute = async (
  wallet,
  { fromToken, toToken, toChainId, amount, destGas = 0 }
) => {
  const {
    contracts: {
      services: { LayerZero },
    },
  } = await getChainByWallet(wallet);
  const { provider: destProvider, lzChainId: destLzChainId } =
    getChainById(toChainId);
  const destWallet = new Wallet(wallet.privateKey, destProvider);

  const destTokenContract = new Contract(
    toToken.address,
    toToken.abi,
    destWallet
  );
  const destTokenBalance = await destTokenContract.balanceOf(
    destWallet.address
  );

  const lzRouterContract = new Contract(
    LayerZero.LZRouter.address,
    LayerZero.LZRouter.abi,
    wallet
  );

  const bnAmount = new BigNumber(amount);

  await approveToken(wallet, {
    amount,
    token: fromToken,
    spender: LayerZero.LZRouter.address,
  });

  const lzBridgeFee = (
    await lzRouterContract.quoteLayerZeroFee(
      destLzChainId,
      1,
      ZeroAddress,
      ZeroHash,
      [0, destGas, wallet.address]
    )
  )[0];

  const swapMethodArgs = [
    destLzChainId,
    fromToken.StargatePool.id,
    toToken.StargatePool.id,
    wallet.address,
    bnAmount.toNumber(),
    bnAmount
      .multipliedBy(SLIPPAGE_MULTIPLIER)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toNumber(),
    [0, destGas, wallet.address],
    wallet.address,
    ZeroHash,
  ];
  const txParams = {
    value: lzBridgeFee,
    data: lzRouterContract.interface.encodeFunctionData("swap", swapMethodArgs),
    to: LayerZero.LZRouter.address,
  };

  await sendTx(wallet, txParams);
  await waitForBalance(destWallet, {
    token: toToken,
    amount: new BigNumber(destTokenBalance)
      .plus(amount)
      .multipliedBy(1 - (slippage + 2) / 100)
      .toString(),
  });
};
