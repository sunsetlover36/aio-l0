import { ArbFiatTokenV2 } from "../../../abis";
import { StargatePool } from "./pool";

const address = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
export const USDC = {
  ticker: "USDC",
  address,
  abi: ArbFiatTokenV2,
  decimals: 6,
  StargatePool,
};
