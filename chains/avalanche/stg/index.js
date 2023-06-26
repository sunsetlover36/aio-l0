import { StargateToken } from "../../../abis";

const address = "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590";
export const STG = {
  ticker: "STG",
  address,
  abi: StargateToken,
  decimals: 18,
};

export { STGVotingEscrow } from "./stgVotingEscrow";
