import { Contract } from "ethers";
import BigNumber from "bignumber.js";

import { sleep } from "./sleep";

// TODO: log waiting so user dont think that soft lagged
export const waitForBalance = async (wallet, { token, amount }) => {
  const tokenContract = new Contract(token.address, token.abi, wallet);
  const tokenBalance = await tokenContract.balanceOf(wallet.address);

  if (new BigNumber(tokenBalance).gte(amount)) {
    return true;
  }

  await sleep(3);
  return await waitForBalance(wallet, { token, amount });
};
