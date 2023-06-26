import { AvalancheFiatTokenV2 } from "../../../abis";
import { StargatePool } from "./pool";

const address = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
export const USDC = {
  ticker: "USDC",
  address,
  abi: AvalancheFiatTokenV2,
  decimals: 6,
  StargatePool,
};
