import { StargateToken } from "../../../abis";

const address = "0x6694340fc020c5E6B96567843da2df01b2CE1eb6";
export const STG = {
  ticker: "STG",
  address,
  abi: StargateToken,
  decimals: 18,
};

export { STGVotingEscrow } from "./stgVotingEscrow";
