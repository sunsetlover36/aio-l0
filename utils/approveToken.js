import BigNumber from "bignumber.js";
import { Contract } from "ethers";

import { APPROVAL_AMOUNT_MULTIPLIER } from "../constants";
import { chalk } from "./chalk";
import { randfloat } from "./rand";

export const approveToken = async (wallet, { amount, token, spender }) => {
  const bnAmount = new BigNumber(amount);

  const tokenContract = new Contract(token.address, token.abi, wallet);

  const allowance = await tokenContract.allowance(wallet.address, spender);
  if (bnAmount.gt(allowance)) {
    const bnMultipliedAmount = new BigNumber(amount)
      .multipliedBy(randfloat(1, APPROVAL_AMOUNT_MULTIPLIER))
      .integerValue(BigNumber.ROUND_FLOOR);

    console.log(
      chalk.gray(
        `Approving ${parseFloat(
          bnMultipliedAmount.dividedBy(10 ** token.decimals).toFixed(6)
        )} ${token.ticker}...`
      )
    );
    const feeData = await wallet.provider.getFeeData();
    const tx = await tokenContract.approve(
      spender,
      bnMultipliedAmount.toString(),
      {
        gasPrice: feeData.gasPrice,
      }
    );
    await wallet.provider.waitForTransaction(tx.hash);
  }
};
