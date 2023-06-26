import { Contract } from "ethers";

import { getChainByWallet, approveToken, sendTx } from "../../utils";

export const execute = async (wallet, { lockTime }) => {
  const {
    contracts: {
      tokens: { STG },
      services: { STGVotingEscrow },
    },
  } = await getChainByWallet(wallet);

  const stgContract = new Contract(STG.address, STG.abi, wallet);
  const stgVotingEscrowContract = new Contract(
    STGVotingEscrow.address,
    STGVotingEscrow.abi,
    wallet
  );
  const stgBalance = await stgContract.balanceOf(wallet.address);

  await approveToken(wallet, {
    amount: stgBalance,
    token: STG,
    spender: STGVotingEscrow.address,
  });

  const txData = {
    data: await stgVotingEscrowContract.interface.encodeFunctionData(
      "create_lock",
      [stgBalance, Math.round((Date.now() + lockTime) / 1000)]
    ),
    to: STGVotingEscrow.address,
  };
  await sendTx(wallet, txData);
};
