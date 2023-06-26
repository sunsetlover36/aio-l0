import { ArbFiatToken } from "../../../abis";
import { StargatePool } from "./pool";

const address = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
export const USDC = {
  ticker: "USDC",
  address,
  abi: ArbFiatToken,
  decimals: 6,
  StargatePool,
};
