import BigNumber from "bignumber.js";
import { Contract, Wallet, ZeroAddress, ZeroHash } from "ethers";

import { config } from "../../config";
import { SLIPPAGE_MULTIPLIER } from "../../constants";
import {
  approveToken,
  getChainById,
  getChainByWallet,
  logLoader,
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
    bnAmount.toString(),
    bnAmount
      .multipliedBy(SLIPPAGE_MULTIPLIER)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString(),
    [0, destGas, "0x0000000000000000000000000000000000000001"],
    wallet.address,
    "0x",
  ];
  const txParams = {
    value: lzBridgeFee.toString(),
    data: lzRouterContract.interface.encodeFunctionData("swap", swapMethodArgs),
    to: LayerZero.LZRouter.address,
  };

  const amountToReceive = new BigNumber(destTokenBalance)
    .plus(
      bnAmount
        .dividedBy(10 ** fromToken.decimals)
        .multipliedBy(10 ** toToken.decimals)
        .multipliedBy(1 - (slippage + 2) / 100)
    )
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString();

  await sendTx(wallet, txParams);
  await logLoader(
    {
      loadingText:
        "Waiting for funds to be transferred to the destination chain...",
      successText: "Funds have arrived!",
    },
    () =>
      waitForBalance(destWallet, {
        token: toToken,
        amount: amountToReceive,
      })
  );
};
