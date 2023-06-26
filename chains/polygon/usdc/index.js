import { PolygonUChildAdministrableERC20 } from "../../../abis";
import { StargatePool } from "./pool";

const address = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
export const USDC = {
  ticker: "USDC",
  address,
  abi: PolygonUChildAdministrableERC20,
  decimals: 6,
  StargatePool,
};
