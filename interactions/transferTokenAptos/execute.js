import { Contract, solidityPacked, ZeroAddress, zeroPadValue } from "ethers";

import {
  convertNativeForRefuel,
  getChainByWallet,
  approveToken,
  sendTx,
} from "../../utils";
import { chains } from "../../chains";

export const execute = async (
  wallet,
  { toAddress, token, amount, destGas = 0 }
) => {
  const fromChain = await getChainByWallet(wallet);
  const {
    contracts: {
      services: { AptosBridge },
    },
  } = fromChain;

  const aptosBridgeContract = new Contract(
    AptosBridge.address,
    AptosBridge.abi,
    wallet
  );

  await approveToken(wallet, { amount, token, spender: AptosBridge.address });

  const aptRefuelAmount = await convertNativeForRefuel({
    fromChain,
    toChain: chains.aptos,
    amount: destGas,
  });

  // Adapter params to refuel APT
  const adapterParams = solidityPacked(
    ["uint16", "uint", "uint", "address"],
    [2, 20000, aptRefuelAmount, wallet.address]
  );

  const bridgeMethodParams = [
    token.address,
    zeroPadValue(toAddress, 32),
    amount,
    [wallet.address, ZeroAddress],
    adapterParams,
  ];
  const nativeFee = await aptosBridgeContract.quoteForSend(
    [wallet.address, ZeroAddress],
    adapterParams
  );

  const txParams = {
    data: aptosBridgeContract.interface.encodeFunctionData(
      "sendToAptos",
      bridgeMethodParams
    ),
    to: AptosBridge.address,
    value: nativeFee[0].toString(),
  };
  await sendTx(wallet, txParams);
};
