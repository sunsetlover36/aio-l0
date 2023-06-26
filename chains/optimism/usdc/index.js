import { OVMFiatToken } from "../../../abis";
import { StargatePool } from "./pool";

const address = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607";
export const USDC = {
  ticker: "USDC",
  address,
  abi: OVMFiatToken,
  decimals: 6,
  StargatePool,
};
