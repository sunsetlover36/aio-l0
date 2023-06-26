import { BscBEP20USDT } from "../../../abis";
import { StargatePool } from "./Pool";

const address = "0x55d398326f99059fF775485246999027B3197955";
export const USDT = {
  ticker: "USDT",
  address,
  abi: BscBEP20USDT,
  decimals: 18,
  StargatePool,
};
