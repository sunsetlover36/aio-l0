import BigNumber from "bignumber.js";
import { Contract, solidityPacked, ZeroAddress, zeroPadValue } from "ethers";

import {
  getChainById,
  getChainByWallet,
  approveToken,
  sendTx,
} from "../../utils";
import { chains } from "../../chains";

export const execute = async (wallet, { amount, destGas = 0, toChainId }) => {
  const {
    chainId,
    contracts: {
      tokens: { BTCb },
      services: { BTCbProxyOFT },
    },
  } = await getChainByWallet(wallet);
  const isAvalanche = chainId === chains.avalanche.chainId;
  const BTCbContract = isAvalanche ? BTCbProxyOFT : BTCb;

  const { lzChainId: toLzChainId } = getChainById(toChainId);

  const btcbProxyOftContract = new Contract(
    BTCbContract.address,
    BTCbContract.abi,
    wallet
  );

  const bnAmount = new BigNumber(amount);

  // Approve 2x of BTC.b balance
  await approveToken(wallet, {
    amount: bnAmount.multipliedBy(2).toString(),
    token: BTCb,
    spender: isAvalanche ? BTCbProxyOFT.address : BTCb.address,
  });

  const bytes32Address = zeroPadValue(wallet.address, 32);

  const adapterParams = solidityPacked(
    ["uint16", "uint", "uint", "address"],
    [2, 200000, destGas, wallet.address]
  );
  const estimatedSendFee = await btcbProxyOftContract.estimateSendFee(
    toLzChainId,
    bytes32Address,
    `0x${amount}`,
    false,
    adapterParams
  );
  const sendMethodArgs = [
    wallet.address,
    toLzChainId,
    bytes32Address,
    amount,
    amount,
    [wallet.address, ZeroAddress, adapterParams],
  ];

  const txData = {
    value: estimatedSendFee[0].toString(),
    to: BTCbContract.address,
    data: btcbProxyOftContract.interface.encodeFunctionData(
      "sendFrom",
      sendMethodArgs
    ),
  };
  await sendTx(wallet, txData);
};
