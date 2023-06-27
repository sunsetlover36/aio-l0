import { Contract } from "ethers";
import BigNumber from "bignumber.js";

import { getChainByWallet } from "../utils";
import { SLIPPAGE_MULTIPLIER } from "../constants";

export const wooracleGetUsdPrice = async (wallet, { token, slippage }) => {
  const {
    contracts: {
      services: { Woo },
    },
  } = await getChainByWallet(wallet);

  const oracle = new Contract(Woo.Wooracle.address, Woo.Wooracle.abi, wallet);
  const priceDecimals = await oracle.decimals(token.address);
  const { priceOut } = await oracle.price(token.address);

  const price = new BigNumber(priceOut.toString())
    .dividedBy(10 ** Number(priceDecimals))
    .toNumber();
  return price * (slippage ? 1 - slippage / 100 : SLIPPAGE_MULTIPLIER);
};
