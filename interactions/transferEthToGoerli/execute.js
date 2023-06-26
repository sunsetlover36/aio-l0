import { Contract, ZeroAddress } from "ethers";
import BigNumber from "bignumber.js";

import { NATIVE_TOKEN_ADDRESS } from "../../constants";
import { estimateLzSendFee, getChainByWallet, sendTx } from "../../utils";

export const execute = async (wallet, { amount }) => {
  const {
    contracts: {
      tokens: { GETH },
      services: { TestnetBridge, Uniswap },
    },
  } = await getChainByWallet(wallet);

  const testnetBridgeContract = new Contract(
    TestnetBridge.address,
    TestnetBridge.abi,
    wallet
  );
  const uniswapQuoterContract = new Contract(
    Uniswap.Quoter.address,
    Uniswap.Quoter.abi,
    wallet
  );

  // Perform dry run
  const encodedTx = uniswapQuoterContract.interface.encodeFunctionData(
    "quoteExactInputSingle",
    [NATIVE_TOKEN_ADDRESS, GETH.address, 3000n, amount, 0n]
  );
  const callResult = await wallet.call({
    to: Uniswap.Quoter.address,
    data: encodedTx,
  });
  const gethToReceive = uniswapQuoterContract.interface.decodeFunctionResult(
    "quoteExactInputSingle",
    callResult
  )[0];

  const lzSendFee = await estimateLzSendFee(wallet);

  const bridgeMethodParams = [
    amount,
    gethToReceive,
    GETH.lzChainId,
    wallet.address,
    wallet.address,
    ZeroAddress,
    "0x",
  ];
  const txParams = {
    value: new BigNumber(amount)
      .plus(new BigNumber(lzSendFee).multipliedBy(3))
      .integerValue(BigNumber.ROUND_FLOOR) // 3 internal transactions
      .toString(),
    data: testnetBridgeContract.interface.encodeFunctionData(
      "swapAndBridge",
      bridgeMethodParams
    ),
    to: TestnetBridge.address,
  };
  await sendTx(wallet, txParams);
};
